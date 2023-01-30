const Datastore = require("nedb"); //including the nedb node package for database 
const logged_in_database = new Datastore("Database/Currently_Logged_in.db");

async function Validate_Session(Sesssion)
{
    console.log("searching for session -> ");
    console.log(Sesssion);
    logged_in_database.loadDatabase();

    let Session_Judgement = await new Promise((resolve, reject) => {
        logged_in_database.find({Session_ID : Sesssion},(err,session_match_array) => { //checking if the user is currently logged in
            if (err) reject(err);
            console.log("found logged in data = ");
            console.log(session_match_array);
            let Judgement = session_match_array;
            resolve(Judgement);
        })
    });
    return Session_Judgement;    
}

module.exports = {Validate_Session}