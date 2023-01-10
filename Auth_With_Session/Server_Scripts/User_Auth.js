const Datastore = require("nedb"); //including the nedb node package for database 

//NEDB
const users_database = new Datastore("Database/users.db");
const logged_in_database = new Datastore("Database/Currently_Logged_in.db");


function Register_User(User_Credentials,res) 
{
    console.log(User_Credentials);
    //NEDB
    users_database.loadDatabase();
    users_database.find({Username : User_Credentials.Username},(err,data)=>{

    let verdict = {
    }

    console.log("we found this -> ");
    console.log(data);

    if(data.length == 0)
    {
        users_database.insert(User_Credentials);
        verdict.status = "User Successfully Registered";
    }
    else
    {
        verdict.status = "Registration Failed";
        verdict.description = "Username already Exists";
    }
        res.json(verdict);
  })
}


function Logged_In(Session,res)
{
        console.log("searching for");
        console.log(Session);
        logged_in_database.loadDatabase();
        logged_in_database.find({Session_ID : Session},(err,data) => { //checking if the user is currently logged in
        
        let verdict = {
        }

        console.log("found logged in data = ");
        console.log(data);

        if(data.length == 1)
            verdict.Status = "Valid (Already Logged In)";
        else
            verdict.Status = "Not Logged In";

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
                                            
                            let User_Session = {
                                Username : User_Credentials.Username,
                                Session_ID : verdict.Session_ID
                            }     
                            logged_in_database.insert(User_Session);
                        }
                        else
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
                            verdict.description = "You were already logged in through one Device , we have logged out that device ";
                        }
                        res.json(verdict);
                    })
                }
                else
                {
                    verdict.Status = "Fail";
                    verdict.Descreption = "Password Wrong!";
                    res.json(verdict);
                }

            }
            else
            {
                verdict.Status = "Fail";
                verdict.Descreption = "User not found in DB";
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

        if(data.length == 0)
        {
            verdict.status = "Fail";
            verdict.description = "User already logged out";
            res.json(verdict);
        }
        else
        {
            logged_in_database.remove(data[0],{}, function (err, numRemoved) {
                console.log("Entries deleted = " + numRemoved);
                verdict.status = "Pass";
                verdict.description = "User successfully Logged out";
                res.json(verdict);
            });
        }
    });
}
module.exports = {Register_User,Logged_In,Authorize_User,Logout}