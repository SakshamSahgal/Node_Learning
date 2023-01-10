
function Validate_Session(Session,res)
{
        console.log("searching for session -> ");
        console.log(Session);
        logged_in_database.loadDatabase();
        logged_in_database.find({Session_ID : Session},(err,data) => { //checking if the user is currently logged in
        
        let verdict = {
        }

        console.log("found logged in data = ");
        console.log(data);

        if(data.length == 1)
            verdict.Status = "Session Matched"; //user already logged in
        else
            verdict.Status = "Invalid Session"; //False/Expired Cookie

        res.json(verdict);
    })
}