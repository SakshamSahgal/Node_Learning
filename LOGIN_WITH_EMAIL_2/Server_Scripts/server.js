//------------------------------------------------------------Node Packages-----------------------------------------------------

//EXPRESS
const express = require("express"); //including express package for creating a server
const app = express();
const port = 3000;
app.listen(port); //function called when the server starts listening
app.use(express.static('Public')) //the public folder is what is visible to the client (actually a subset of that folder (depending on the currently rendered webpage and it's used resources))
app.use(express.json({limit : '1mb'} )); //telling that my app will be sending/recieving data in json format (limiting to 1MB)

//------------------------------------------------------------------------------------------------------------------------------

const {Register,Validate_OTP} = require("./Auth_Scripts/register.js");
const {Authorize_User} = require("./Auth_Scripts/login.js");
const {Validate_Session} = require("./Auth_Scripts/validate_session.js");
const {Logout} = require("./Auth_Scripts/logout.js");
const {Delete_Account} = require("./Auth_Scripts/Delete_Acc.js");
const {Profile_Page,Fetch_Profile_Pictures,Update_Profile_Picture,Remove_Profile_Picture,Fetch_Profile,Update_Username} = require("./Profile_Page.js")
const {Fetch_All_Users} = require("./user_queries.js");
const {Fetch_Dashboard_Content} = require("./Dashboard_script.js");


app.post('/register_api',(req,res) => { //registering a user (registration on hold until OTP verification)
    Register(req.body,res);
});

app.post('/validate_OTP',(req,res) => { //validating OTP 
    Validate_OTP(req.body,res);
});

app.post('/auth_api',async (req,res) => { //Authorizes user
    Authorize_User(req.body,res);
})

app.post('/validate_session_api',(req,res) => { //checks if session cookie is valid
    Validate_Session(req.body.Session_ID).then((Session_matched)=>{
        verdict = {}
        if(Session_matched.length)
            verdict.Status = "Session Matched";
        else
            verdict.Status = "Invalid Session";
        res.json(verdict);
    })
})

app.post('/logout_api',(req,res) => { //Logout user
    Logout(req.body.Session_ID,res);
})

app.post('/Delete_Account',(req,res) => { //Deletes user account
    Delete_Account(req.body.Session_ID,res);
})

app.post("/Profile_Page_api",(req,res) => { //Get your onw profile page information 
    Profile_Page(req.body,res);
})

app.post("/Fetch_Profile_api",(req,res) => { //fetches public details of a given profile
    Fetch_Profile(req.body,res);
})

app.post("/fetch_Profile_Pictures_api",(req,res) => { //fetch all the available profile picture paths
    Fetch_Profile_Pictures(req.body.Session_ID,res);
})

app.post("/update_profile_picture_api",(req,res) => {
    Update_Profile_Picture(req.body,res);
})
app.post("/Remove_Profile_Picture_api",(req,res) => {
    Remove_Profile_Picture(req.body.Session_ID,res);
})

app.post("/Fetch_Users",(req,res)=> { //Fetch all users data to be displayed on users.html
    Fetch_All_Users(req.body,res);
})

app.post("/Dashboard_api",(req,res)=> { //fetch dashboard contents
    Fetch_Dashboard_Content(req.body,res);
})

app.post("/Update_Username_api",(req,res) => { //post called when user submits data to edit profile form
    Update_Username(req.body,res);
})