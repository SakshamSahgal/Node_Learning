const Datastore = require("nedb"); //including the nedb node package for database
const SendMail = require("../SendMail.js"); //to access send mail function

const users_database = new Datastore("Database/users.db"); 
const Registration_On_Hold = new Datastore("Database/Registration_On_Hold.db");
const {Create_Directory,Delete_Directory} = require("../directories.js")

function validate_username(str)
{
    //The number of characters must be between 5 and 15.
    //The string should only contain alphanumeric characters and/or underscores (_).
    //The first character of the string should be alphabetic.
    return /^[A-Za-z][A-Za-z0-9_]{4,14}$/.test(str);
}

function validate_password(str)
{
    //The minimum number of characters must be 8.
    //The string must have at least one digit.
    //The string must have at least one uppercase character.
    //The string must have at least one lowercase character.
    //The string must have at least one special character.
    return /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/.test(str);
}


function Register_User(User_Credentials,res) 
{
    console.log(User_Credentials);
    //NEDB
    users_database.loadDatabase();
    users_database.find({Email : User_Credentials.Email},(err,email_querry_result_array)=>{

    let verdict = {
    }

    console.log("we found this on email querry -> ");
    console.log(email_querry_result_array);

    if(email_querry_result_array.length == 0) //no Email match
    {
        users_database.find({Username : User_Credentials.Username},(err,username_querry_result_array) => {
            
            console.log("we found this on username querry -> ");
            console.log(username_querry_result_array);
            
            if(username_querry_result_array.length == 0) //no username matched
            {
                if(validate_username(User_Credentials.Username)) //if valid Username
                {
                    if(validate_password(User_Credentials.Password)) //if valid password
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

                        email_info = {
                            to : User_Credentials.Email,
                            OTP : User_Credentials.OTP
                        }
                        
                        Registration_On_Hold.insert(User_Credentials);
                        SendMail(email_info); //sending mail
                        verdict.status = "Success";
                        verdict.description = "OTP send Successfully";
                        res.json(verdict);
                    })
                    }   
                    else
                    {
                        verdict.status = "Fail";
                        verdict.description = "Invalid Password Format";
                        res.json(verdict);
                    }
                }
                else
                {
                    verdict.status = "Fail";
                    verdict.description = "Invalid Username Format";
                    res.json(verdict);
                }
            }
            else
            {
                verdict.status = "Registration Failed";
                verdict.description = "Username already owned by someone else";
                res.json(verdict);
            }

        })
    }
    else
    {
        verdict.status = "Registration Failed";
        verdict.description = "Email already Exists";
        res.json(verdict);
    }
  })
}




function Validate_OTP(OTP_data,res)
{
    console.log("Got = ");
    console.log(OTP_data);

    let verdict = {
    }

    Registration_On_Hold.find({OTP : String(OTP_data.OTP)},function(err,OTP_matched_Querry_Array) {

        console.log("OTP querry result = ");
        console.log(OTP_matched_Querry_Array);

        if(OTP_matched_Querry_Array.length == 0) //no OTP matched
        {
            verdict.status = "Fail";
            verdict.description = "Wrong OTP";
            res.json(verdict);
        }
        else
        {
          let current_Time = Date.now();
          let Entered_time = OTP_matched_Querry_Array[0].Timestamp;
          let time_difference = (current_Time  - Entered_time);
          console.log("time difference = " + time_difference);
          

          if(time_difference > 300000)
          {
            Registration_On_Hold.remove(OTP_matched_Querry_Array[0],{}); //deleting the entry from DB
            verdict.status = "Fail";
            verdict.description = "OTP expired";
            res.json(verdict);
          }
          else
          {
            let User = {
                Username : OTP_matched_Querry_Array[0].Username,
                Gender : OTP_matched_Querry_Array[0].Gender,
                Email : OTP_matched_Querry_Array[0].Email,
                Password : OTP_matched_Querry_Array[0].Password,
            }
            users_database.insert(User); //inserting into Users Database
            Registration_On_Hold.remove(OTP_matched_Querry_Array[0],{}); //deleting the entry from DB
            let dir = "Media/" + User.Username;
            console.log(Create_Directory(dir))//creating a Username directory
            verdict.status = "Success";
            verdict.description = "You are Successfully Registered";
            res.json(verdict);
          }
        }

    })
}

module.exports = {Register_User,Validate_OTP};