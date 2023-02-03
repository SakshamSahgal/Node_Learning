//NEDB
const Datastore = require("nedb"); //including the nedb node package for database 
const users = new Datastore("Database/users.db");
const {Validate_Session} = require("./Auth_Scripts/validate_session.js");

function Fetch_Dashboard_Content(req_JSON,res)
{
    let verdict = {}
    Validate_Session(req_JSON.Session_ID).then((session_matched_array) => {
        if(session_matched_array.length)
        {
            let Username = session_matched_array[0].Username;
            users.loadDatabase();
            users.find({Username : Username},(err,user_matched_array) => {
                
                if(user_matched_array.length == 1)
                {
                    verdict.Status = "Pass";
                    verdict.Username = Username;
                    verdict.Profile_Picture = user_matched_array[0].Profile_Picture;
                    res.json(verdict);
                }
                else
                {
                    verdict.Status = "Fail";
                    verdict.Description = "User Not Found";
                    res.json(verdict);
                }
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


module.exports = {Fetch_Dashboard_Content};