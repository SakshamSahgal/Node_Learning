const Datastore = require("nedb"); //including the nedb node package for database
const {Create_Directory,Delete_Directory} = require("./directories.js")

//NEDB
const users_database = new Datastore("Database/users.db"); 
const logged_in_database = new Datastore("Database/Currently_Logged_in.db");
const Registration_On_Hold = new Datastore("Database/Registration_On_Hold.db");

function Validate_Session(Session,res)
{
        console.log("searching for session -> ");
        console.log(Session);
        logged_in_database.loadDatabase();
        logged_in_database.find({Session_ID : Session},(err,data) => { //checking if the user is currently logged in
        
        let verdict = {
        }

        console.log("found logged in data = ");
        console.log(data);

        if(data.length == 1)
            verdict.Status = "Session Matched"; //user already logged in
        else
            verdict.Status = "Invalid Session"; //False/Expired Cookie

        res.json(verdict);
    })
}



function Authorize_User(User_Credentials,res) //called when user is logs in
{
        console.log(User_Credentials);

        users_database.loadDatabase();
        logged_in_database.loadDatabase();

        users_database.find({Username : User_Credentials.Username },(err,user_list) =>{ //finding user in database
            
            console.log("Users matched = ");
            console.log(user_list);

            let verdict = {
            }

            if(user_list.length == 1) //username matches
            {
                if(user_list[0].Password == User_Credentials.Password)
                {
                        logged_in_database.find({Username : User_Credentials.Username},(err,active_list)=> {
                    
                        console.log("Active Users Matched = ");
                        console.log(active_list);
    
                        if(active_list.length == 0) //Not currently Logged in
                        {
                            verdict.Status = "Pass";
                            verdict.Session_ID = String(Date.now());
                            verdict.Description = "Successfully Logged in";

                            let User_Session = {
                                Username : User_Credentials.Username,
                                Session_ID : verdict.Session_ID
                            }

                            logged_in_database.insert(User_Session);
                            console.log(verdict.Description);
                        }
                        else //only possible when cookie is manually erased or user trying to login through other device
                        {
                            // verdict.Status = "Fail";
                            // verdict.Description = "User already Logged in through one device";
                            var overrided_session = JSON.parse(JSON.stringify(active_list[0]));
                            overrided_session.Session_ID = String(Date.now());
                            console.log("---------------------------");
                            console.log(active_list[0]);
                            console.log(overrided_session);
                            console.log("---------------------------");

                            logged_in_database.update(active_list[0],overrided_session,{},(err,numReplaced)=>{
                                console.log("Successfully replaced " + numReplaced + " JSON entries");
                            });
                            verdict.Status = "Pass";
                            verdict.Session_ID = overrided_session.Session_ID;
                            verdict.Description = "You were already logged in through one Device , we have logged out that device ";
                            console.log(verdict.Description);
                        }
                        res.json(verdict);
                    })
                }
                else
                {
                    verdict.Status = "Fail";
                    verdict.Description = "Wrong Password!";
                    console.log("Wrong Password");
                    res.json(verdict);
                }

            }
            else
            {
                verdict.Status = "Fail";
                verdict.Description = "User not found in DB";
                console.log("User not found in DB");
                res.json(verdict);
            }
    });
}


function Logout(Sessionid,res)
{
    logged_in_database.loadDatabase();
    logged_in_database.find({Session_ID : Sessionid},(err,data)=>{
        
        console.log("Found = ");
        console.log(data);

        let verdict = {
        }

        if(data.length == 0) //Other device has logged in
        {
            verdict.Status = "Fail";
            verdict.description = "User already logged out";
            res.json(verdict);
        }
        else
        {
            logged_in_database.remove(data[0],{}, function (err, numRemoved) {
                console.log("Entries deleted = " + numRemoved);
                verdict.Status = "Pass";
                verdict.description = "User successfully Logged out";
                res.json(verdict);
            });
        }
    });
}

function Delete_Account(Sessionid,res)
{
        console.log("searching for session -> ");
        console.log(Sessionid);
        logged_in_database.loadDatabase();
        logged_in_database.find({Session_ID : Sessionid},(err,data) => { //checking if the user is in currently logged in DB
        
        let verdict = {
        }

        console.log("found logged in data = ");
        console.log(data);

        if(data.length == 1) //session matched
        {
            var username = data[0].Username;
            logged_in_database.remove(data[0],{}, function (err, numRemoved) {
            console.log("Entries deleted from Currently_Logged_in.db = " + numRemoved);
            
                users_database.loadDatabase();
                users_database.remove({Username : username},{},function(err,numRemoved) {
                    console.log("Entries deleted from users.db = " + numRemoved);
                    let dir = "Media/" + username;
                    console.log(Delete_Directory(dir));
                    verdict.Status = "Successfully Deleted Account";
                    res.json(verdict);
                })
            });
        }
        else
        {
            verdict.Status = "Invalid Session"; //False/Expired Cookie
            res.json(verdict);
        }
        
    });
}

module.exports = {Validate_Session,Authorize_User,Logout,Delete_Account}