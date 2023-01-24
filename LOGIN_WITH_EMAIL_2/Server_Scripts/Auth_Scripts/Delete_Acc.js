//NEDB
const Datastore = require("nedb"); //including the nedb node package for database 
const logged_in_database = new Datastore("Database/Currently_Logged_in.db");
const users_database = new Datastore("Database/users.db");
const {Delete_Directory} = require("../directories.js"); //for creating Directories

function Delete_Account(Sessionid,res)
{
        console.log("searching for session -> ");
        console.log(Sessionid);
        logged_in_database.loadDatabase();
        logged_in_database.find({Session_ID : Sessionid},(err,data) => { //checking if the user is in currently logged in DB
        
        let verdict = {
        }

        console.log("found logged in data = ");
        console.log(data);

        if(data.length == 1) //session matched
        {
            var username = data[0].Username;
            logged_in_database.remove(data[0],{}, function (err, numRemoved) {
            console.log("Entries deleted from Currently_Logged_in.db = " + numRemoved);
            
                users_database.loadDatabase();
                users_database.remove({Username : username},{},function(err,numRemoved) {
                    console.log("Entries deleted from users.db = " + numRemoved);
                    let dir = "Media/" + username;
                    console.log(Delete_Directory(dir));
                    verdict.Status = "Successfully Deleted Account";
                    res.json(verdict);
                })
            });
        }
        else
        {
            verdict.Status = "Invalid Session"; //False/Expired Cookie
            res.json(verdict);
        }

    });
}

module.exports = {Delete_Account}