const Datastore = require("nedb"); //including the nedb node package for database 
const logged_in_database = new Datastore("Database/Currently_Logged_in.db");
const users = new Datastore("Database/users.db");

function Profile_Page(profile_page_req,res)
{
        console.log("searching for session -> ");
        console.log(profile_page_req.Session_ID);
        logged_in_database.loadDatabase();
        logged_in_database.find({Session_ID : profile_page_req.Session_ID},(err,session_match_array) => { //checking if the user is currently logged in
        
            let verdict = {
            }

            console.log("found logged in data = ");
            console.log(session_match_array);

            if(session_match_array.length == 1) //user logged in
            {
                console.log("Searching for this email in users");
                verdict.Username = session_match_array[0].Username;
                verdict.Email = session_match_array[0].Email;
                users.loadDatabase();
                users.find({Email : verdict.Email} , (err,user_matched_array) => { //fetching the gender , bio , profile_picture of user

                    console.log("Found Email Data = ");
                    console.log(user_matched_array);

                    if(user_matched_array.length == 1) //user matched
                    {
                        verdict.Status = "Pass";
                        verdict.Bio = user_matched_array[0].Bio;
                        verdict.Gender = user_matched_array[0].Gender;
                        verdict.Profile_Picture = user_matched_array[0].Profile_Picture;
                        res.json(verdict);
                    }
                    else //only possible when someone manually deleted the user from the database while he is logged in
                        res.json({Status : "User not found in DB"});
                })
            }
            else //False/Expired Cookie
            {
                verdict.Status = "Invalid Session"; 
                res.json(verdict);
            }

        })
}


module.exports = {Profile_Page};