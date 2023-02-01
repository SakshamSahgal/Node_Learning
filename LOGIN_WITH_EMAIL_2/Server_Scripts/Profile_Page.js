const Datastore = require("nedb"); //including the nedb node package for database 
const logged_in_database = new Datastore("Database/Currently_Logged_in.db");
const users = new Datastore("Database/users.db");
const fs = require("fs");
const {Validate_Session} = require("./Auth_Scripts/validate_session");
const e = require("express");
const { json } = require("express");

function Profile_Page(profile_page_req,res)
{
        let verdict = {
        }

        Validate_Session(profile_page_req.Session_ID).then((Session_Result) =>{
            
            if(Session_Result.length)
            {
                console.log("Searching for this email in users");
                verdict.Username = Session_Result[0].Username;
                verdict.Email = Session_Result[0].Email;
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
            else
            {
                verdict.Status = "Invalid Session"; 
                res.json(verdict);
            }
        })
}

function Fetch_Profile_Pictures(Session,res)
{
        let verdict = {
        }

        Validate_Session(Session).then((Session_Result) => {

            if(Session_Result.length)
            {
                const files = fs.readdirSync("./Public/GUI_Resources/Profile_Pictures");

                let paths = []

                try {
                    files.forEach( file => {
                        //console.log(file);
                        this_path = "./GUI_Resources/Profile_Pictures/" + file;
                        paths.push(this_path);
                    })

                    users.loadDatabase();
                    let email = Session_Result[0].Email;
                    users.find( {Email : email} , (err,user_matched_array) => { //searching the user with this email

                        console.log("Users Matched Array");
                        console.log(user_matched_array);
                        
                        if(user_matched_array.length == 1)
                        {
                            let Current_Profile_Picture = user_matched_array[0].Profile_Picture;
                            verdict.Status = "Pass";
                            verdict.Paths = paths;
                            verdict.Current_Profile_Picture = Current_Profile_Picture;
                            res.json(verdict);
                        }
                        else
                        {
                            verdict.Status = "Fail";
                            verdict.Description = "User not Found In DB";
                            res.json(verdict);
                        }
                    })
                }
                catch (error)
                {
                    verdict.Status = "Fail";
                    verdict.Datastore = "Cannot fetch files in Directory";
                    console.log(error);
                    res.json(verdict);
                }
            }
            else
            {
                verdict.Status = "Invalid Session";
                res.json(verdict);
            }

        });
}

function Update_Profile_Picture(req_JSON,res)
{   
    let verdict = {
    }

    Validate_Session(req_JSON.Session_ID).then((Session_Result) => {

        if(Session_Result.length)
        {
            let this_user_email = Session_Result[0].Email;
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
        else
        {
            verdict.Status = "Invalid Session";
            res.json(verdict);
        }

    })

}

function Fetch_Profile(req_JSON,res)
{
    verdict = {};
    Validate_Session(req_JSON.Session_ID).then((Session_Result) => {
        if(Session_Result.length) //valid Session
        {
            users.loadDatabase();
            users.find({Username : req_JSON.Username} , (err,user_matched_array) => {

                if(user_matched_array.length)
                {
                    if(user_matched_array[0].Username == Session_Result[0].Username) //you are accessing your own Profile
                    {
                        verdict.Status = "Fail";
                        verdict.Description = "You are accessing your own profile";
                        res.json(verdict);
                    }
                    else
                    {
                        let JSON_to_Send={
                            Status : "Pass",
                            Username : user_matched_array[0].Username,
                            Gender : user_matched_array[0].Gender,
                            Email : user_matched_array[0].Email,
                            Profile_Picture : user_matched_array[0].Profile_Picture,
                            Bio : user_matched_array[0].Bio
                        }
    
                        logged_in_database.loadDatabase();
                        logged_in_database.find({Username : req_JSON.Username} , (err,logged_in_array) => {
                            
                            if(logged_in_array.length == 1)
                                JSON_to_Send.Activity_Status = "Online";
                            else
                                JSON_to_Send.Activity_Status = "Offline";
                            
                            res.json(JSON_to_Send);
                        })
                    }

                }
                else
                {
                    verdict.Status = "Fail";
                    verdict.Description = "User not found";
                    res.json(verdict);
                }
            })
        }
        else
        {
            verdict.Status = "Invalid Session";
            res.json(verdict);
        }
    })
}


function Remove_Profile_Picture(Session,res)
{
    verdict = {}

    Validate_Session(Session).then((Session_Result) => {
        
        console.log(Session_Result);

        if(Session_Result.length) //session is matched
        {
            let email = Session_Result[0].Email;
            users.loadDatabase();
            users.find({Email : email},(err,user_matched_array) => {
                console.log("User matched = ");
                console.log(user_matched_array);
                if(user_matched_array.length == 1) //user found in DB
                {
                    let Cur_Profile_Picture = user_matched_array[0].Profile_Picture;
                    if(Cur_Profile_Picture.includes("No_photo.gif"))
                    {
                        verdict.Status = "Profile picture already removed";
                        res.json(verdict);
                    }
                    else
                    {
                        var overrided_JSON = JSON.parse(JSON.stringify(user_matched_array[0]));
                        overrided_JSON.Profile_Picture = "./GUI_Resources/No_photo.gif";

                        users.update(user_matched_array[0],overrided_JSON,{},(err,numReplaced) => {
                            console.log("Successfully replaced " + numReplaced + " JSON entries");
                            verdict.Status = "Success";
                            verdict.Description = "Successfully Removed Profile Picture";
                            res.json(verdict);
                        })

                    }
                }
                else
                {
                    verdict.Status = "User not found in DB";
                    res.json(verdict);
                }
            })
        }
        else
        {
            verdict.Status = "Invalid Session";
            res.json(verdict);
        }
    })
    
}

module.exports = {Profile_Page,Fetch_Profile_Pictures,Update_Profile_Picture,Remove_Profile_Picture,Fetch_Profile};