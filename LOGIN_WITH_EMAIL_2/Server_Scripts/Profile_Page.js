const Datastore = require("nedb"); //including the nedb node package for database 
const logged_in_database = new Datastore("Database/Currently_Logged_in.db");
const users = new Datastore("Database/users.db");
const fs = require("fs");

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

function Fetch_Profile_Pictures(Session,res)
{
        console.log("searching for session -> ");
        console.log(Session);
        logged_in_database.loadDatabase(); //loading the logged in database
        logged_in_database.find({Session_ID : Session},(err,data) => { //checking if the user is currently logged in
        
        let verdict = {
        }

        console.log("found logged in data = ");
        console.log(data);

        if(data.length == 1) //session Matched
        {
            const files = fs.readdirSync("./Public/GUI_Resources/Profile_Pictures");

            let paths = []

            try {
                files.forEach( file => {
                    //console.log(file);
                    this_path = "./GUI_Resources/Profile_Pictures/" + file;
                    paths.push(this_path);
                })
                verdict.Status = "Pass";
                verdict.Paths = paths;
                res.json(verdict);
            }
            catch (error)
            {
                verdict.Status = "Fail";
                console.log(error);
                res.json(verdict);
            }
        }
        else   //False/Expired Cookie
        {
            verdict.Status = "Invalid Session";
            res.json(verdict);
        }
    })
}

function Update_Profile_Picture(req_JSON,res)
{
        console.log("searching for session -> ");
        console.log(req_JSON.Session_ID);
        logged_in_database.loadDatabase(); //loading the logged in database
        logged_in_database.find({Session_ID : req_JSON.Session_ID},(err,session_match_array) => { //checking if the user is currently logged in
        
        let verdict = {
        }

        console.log("found logged in data = ");
        console.log(session_match_array);

        if(session_match_array.length == 1) //session Matched
        {
            let this_user_email = session_match_array[0].Email;
            users.loadDatabase();
            users.find({Email : this_user_email},(err,user_matched_array) => {

                console.log("user matched array = ");
                console.log(user_matched_array);
                var overrided_JSON = JSON.parse(JSON.stringify(user_matched_array[0]));
                overrided_JSON.Profile_Picture = req_JSON.Profile_Picture;

                if(user_matched_array.length == 1) //user matched
                {
                    users.update(user_matched_array[0],overrided_JSON,{},(err,numReplaced)=>{
                        console.log("Successfully replaced " + numReplaced + " JSON entries");
                        verdict.Status = "Success";
                        verdict.Description = "Successfully Updated Profile Picture";
                        res.json(verdict);
                    });
                }
                else
                {
                    verdict.Status = "Fail";
                    verdict.Description = "User not found in DB";
                    res.json(verdict);
                }

            });
        }
        else   //False/Expired Cookie
        {
            verdict.Status = "Invalid Session";
            res.json(verdict);
        }
    })
}

module.exports = {Profile_Page,Fetch_Profile_Pictures,Update_Profile_Picture};