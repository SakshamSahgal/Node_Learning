//NEDB
const Datastore = require("nedb"); //including the nedb node package for database 
const users_database = new Datastore("Database/users.db");
const logged_in_database = new Datastore("Database/Currently_Logged_in.db");


function validate_email(str)
{
    let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");

    if(regex.test(str))
        return "valid Email";
    else
        return "Invalid Email";
}

function validate_password(str)
{
    //The minimum number of characters must be 8.
    //The string must have at least one digit.
    //The string must have at least one uppercase character.
    //The string must have at least one lowercase character.
    //The string must have at least one special character.

    if(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(str))
        return "Valid Password";
    else
        return "Invalid Password";
}

function Authorize_User(User_Credentials,res) //called when user is logs in
{
        console.log(User_Credentials);

        let verdict = {
        }

        if(validate_email(User_Credentials.Email) == "Invalid Email" ||  validate_password(User_Credentials.Password) == "Invalid Password")
        {
            verdict.Status = "Fail";
            verdict.Description = validate_email(User_Credentials.Email) + " , " + validate_password(User_Credentials.Password);
            res.json(verdict);
        }
        else
        {
            users_database.loadDatabase();
            logged_in_database.loadDatabase();

            users_database.find({Email : User_Credentials.Email },(err,user_list) =>{ //finding user in database
                
                console.log("Users matched = ");
                console.log(user_list);

        
                if(user_list.length == 1) //Email matches
                {
                    if(user_list[0].Password == User_Credentials.Password)
                    {
                            logged_in_database.find({Email : User_Credentials.Email},(err,active_list)=> {
                        
                            console.log("Active Users Matched = ");
                            console.log(active_list);
        
                            if(active_list.length == 0) //Not currently Logged in
                            {
                                verdict.Status = "Pass";
                                verdict.Session_ID = String(Date.now());
                                verdict.Description = "Successfully Logged in";

                                let User_Session = {
                                    Username : user_list[0].Username,
                                    Email : User_Credentials.Email,
                                    Session_ID : verdict.Session_ID
                                }

                                logged_in_database.insert(User_Session);
                                console.log(verdict.Description);
                            }
                            else //only possible when cookie is manually erased or user trying to log-in through other device
                            {
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
}


module.exports = {Authorize_User};