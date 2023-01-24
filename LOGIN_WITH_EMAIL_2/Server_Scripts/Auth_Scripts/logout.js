//NEDB
const Datastore = require("nedb"); //including the nedb node package for database 
const logged_in_database = new Datastore("Database/Currently_Logged_in.db");


function Logout(Sessionid,res)
{
    logged_in_database.loadDatabase();
    logged_in_database.find({Session_ID : Sessionid},(err,data)=>{
        
        console.log("Found = ");
        console.log(data);

        let verdict = {
        }

        if(data.length == 0) //Other device has logged in or invalid session ID
        {
            verdict.Status = "Fail";
            verdict.description = "User already logged out or Invalid Session ID";
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

module.exports = {Logout};