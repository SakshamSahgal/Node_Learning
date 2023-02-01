
//NEDB
const Datastore = require("nedb"); //including the nedb node package for database 
const users_database = new Datastore("Database/users.db");
// const logged_in_database = new Datastore("Database/Currently_Logged_in.db");
const Registration_On_Hold = new Datastore("Database/Registration_On_Hold.db");
const {Create_Directory} = require("../directories.js"); //for creating Directories
const SendMail = require("./SendMail.js");

const fs = require("fs");

async function Username_Exists_In_DB(username) { //asynchronous function which returns whether username exists in DB

    users_database.loadDatabase(); //loading the users_database

    let Username_Judgement = await new Promise((resolve, reject) => {
        users_database.find({Username : username},(err,username_querry_array) => {
           
            if (err) reject(err);
            
            console.log("Username querry result : ");
            console.log(username_querry_array);

            let Judgement = (username_querry_array.length == 0) ? "Username doesn't exist in DB" : "Username already exist in DB";
            //console.log("Username judgement = " + Judgement + " updated");
            resolve(Judgement);
        });
    });

    return Username_Judgement;
}

async function Email_Exists_in_DB(email) { //asynchronous function which returns whether email exists in DB

    users_database.loadDatabase(); //loading the users_database

    let Email_Judgement = await new Promise((resolve, reject) => {
        users_database.find({Email : email},(err,email_querry_result_array)=>{

            if (err) reject(err);

            console.log("email querry result : ");
            console.log(email_querry_result_array);

            let Judgement = (email_querry_result_array.length == 0) ? "Email doesn't exist in DB" : "Email already Exists in DB";
            // console.log("Email judgement = " + Email_Judgement + " updated");
            resolve(Judgement);
        })
    });

    return Email_Judgement;
}

function validate_username(str)
{
    //The number of characters must be between 5 and 15.
    //The string should only contain alphanumeric characters and/or underscores (_).
    //The first character of the string should be alphabetic.

    if(/^[A-Za-z][A-Za-z0-9_]{4,14}$/.test(str))
        return "Valid Username";
    else
        return "Invalid Username";
}

function validate_email(str)
{
    let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");

    if(regex.test(str))
        return "Valid Email";
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

function Register(User_Credentials,res)
{
    console.log(User_Credentials);

    let verdict={
        Status : "Fail",
        Username_Judgement : validate_username(User_Credentials.Username),
        Password_Judgement : validate_password(User_Credentials.Password),
        Email_Judgement : validate_email(User_Credentials.Email)
    }

    if(verdict.Username_Judgement == "Invalid Username" || verdict.Password_Judgement == "Invalid Password" || verdict.Email_Judgement == "Invalid Email")
        res.json(verdict);
    else
    {
        Username_Exists_In_DB(User_Credentials.Username).then( (Username_Judgement_got) => {
            
            verdict.Username_Judgement = Username_Judgement_got;
    
            Email_Exists_in_DB(User_Credentials.Email).then( (Email_Judgement_got) => {
                    
                verdict.Email_Judgement = Email_Judgement_got;

                    if(Username_Judgement_got == "Username doesn't exist in DB" && Email_Judgement_got == "Email doesn't exist in DB" )
                    {
                            Registration_On_Hold.loadDatabase();
                            Registration_On_Hold.find({Email: User_Credentials.Email},(err,Registration_On_Hold_querry_array) => {
                                
                                console.log("we found this on Registration_On_Hold Email querry -> ");
                                console.log(Registration_On_Hold_querry_array);
                                            
                                if(Registration_On_Hold_querry_array.length != 0) //email found in registration on hold
                                    Registration_On_Hold.remove(Registration_On_Hold_querry_array[0],{}); //Deleting the entry from DB

                                console.log("Generating OTP..");
                                User_Credentials.Timestamp = (Date.now());
                                User_Credentials.OTP = String(User_Credentials.Timestamp%(1000000007));
                                console.log("OTP generated " + User_Credentials.OTP);
                                
                                Registration_On_Hold.insert(User_Credentials);

                                email_info = {
                                    to : User_Credentials.Email,
                                    OTP : User_Credentials.OTP
                                }

                                SendMail(email_info); //sending mail
                                verdict.Status = "Success";
                                verdict.Description = "OTP send Successfully";
                                res.json(verdict);
                            })
                    }
                    else
                        res.json(verdict);
            });
        });  
    }
}

function Validate_OTP(OTP_data,res)
{
    console.log("Got = ");
    console.log(OTP_data);

    let verdict = {
    }

    Registration_On_Hold.find({OTP : String(OTP_data.OTP) , Username : OTP_data.Username },function(err,OTP_matched_Querry_Array) { //checking if OTP matches 

        console.log("OTP querry result = ");
        console.log(OTP_matched_Querry_Array);

        if(OTP_matched_Querry_Array.length == 0) //no OTP matched
        {
            verdict.Status = "Fail";
            verdict.Description = "Wrong OTP";
            res.json(verdict);
        }
        else
        {
          let current_Time = Date.now();
          let Entered_time = OTP_matched_Querry_Array[0].Timestamp; //time at which OTP was generated
          let time_difference = (current_Time  - Entered_time);
          console.log("time difference = " + time_difference);

          if(time_difference > 300000) //time difference more than 5 minutes (300000 ms)
          {
            Registration_On_Hold.remove(OTP_matched_Querry_Array[0],{}); //deleting the entry from DB
            verdict.Status = "Fail";
            verdict.Description = "OTP expired";
            res.json(verdict);
          }
          else
          {
            let User = {
                Username : OTP_matched_Querry_Array[0].Username,
                Gender : OTP_matched_Querry_Array[0].Gender,
                Email : OTP_matched_Querry_Array[0].Email,
                Password : OTP_matched_Querry_Array[0].Password,
                Profile_Picture : "./GUI_Resources/No_photo.gif",
                Bio : "N/A",
            }
            
            users_database.insert(User); //inserting into Users Database
            Registration_On_Hold.remove(OTP_matched_Querry_Array[0],{}); //deleting the entry from DB
            let dir = "Media/" + User.Username;
            console.log(Create_Directory(dir))//creating a Username directory
            fs.copyFileSync("Public/Profiles/Profile_HTML_Template.html","Public/Profiles/" + User.Username + ".html"); //creating his personal profile page (just copying from the template html)
            verdict.Status = "Success";
            verdict.Description = "You are Successfully Registered";
            res.json(verdict);
          }
        }

    })
}

module.exports = {Register,Validate_OTP}