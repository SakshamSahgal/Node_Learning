const {Validate_Session} = require("./Auth_Scripts//validate_session.js");
const Datastore = require("nedb"); //including the nedb node package for database 
const users = new Datastore("Database/users.db");
const logged_in_database = new Datastore("Database/Currently_Logged_in.db");

function Fetch_All_Users(req_JSON,res)
{
    let verdict = {}
    Validate_Session(req_JSON.Session_ID,res).then((session_match_array) => {

        if(session_match_array.length)
        {
            users_array = [] //array that contains the returing JSONs

            users.loadDatabase();
            users.find({},(err,users_matched_array) => { //returning all elements from the users database

                users_matched_array.forEach(element => { //Iterating over each user in the returned array
                    
                    let this_user_json = {} //JSON that stores the returning data of this particular user

                    this_user_json.Username = element.Username;
                    this_user_json.Profile_Picture = element.Profile_Picture;
           
                    logged_in_database.loadDatabase();
                    
                    if(element.Username == session_match_array[0].Username) //if this is my Username
                        verdict.Profile_Picture = element.Profile_Picture;

                    logged_in_database.find({Username : element.Username } , (err,match_in_logged_in_array) => {
                        
                        if(match_in_logged_in_array.length)
                            this_user_json.Activity_Status = "Online";
                        else
                            this_user_json.Activity_Status = "Offline";
                        
                        users_array.push(this_user_json);

                        if(users_array.length == users_matched_array.length)
                        {
                            verdict.Status = "Pass";
                            verdict.users = users_array;
                            res.json(verdict);
                        }
                    })            
                });
            })
        }
        else
        {
            verdict.Status = "Fail";
            verdict.Description = "Invalid Session";
            res.json(verdict);
        }
    })
}

module.exports = {Fetch_All_Users}