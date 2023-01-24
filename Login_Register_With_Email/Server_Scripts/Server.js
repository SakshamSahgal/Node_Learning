//------------------------------------------------------------Node Packages-----------------------------------------------------

//Express
const express = require("express"); //including express package for creating a server
const app = express();
const port = 3000;
app.listen(port); //function called when the server starts listening
app.use(express.static('Public')) //the public folder is what is visible to the client (actually a subset of that folder (depending on the currently rendered webpage and it's used resources))
app.use(express.json({limit : '1mb'} )); //telling that my app will be sending/recieving data in json format (limiting to 1MB)


const {Register_User,Validate_OTP} = require("./Auth_Scripts/register.js") //for using User Auth Script

//------------------------------------------------------------------------------------------------------------------------------


app.post('/validate_session_api',(req,res) => { //checks if session cookie is valid
    Validate_Session(req.body.Session_ID,res);
})

//this method gets data from the client to the server
app.post('/register_api',(req,res) => { //register 
    Register_User(req.body,res);
})

app.post('/auth_api',async (req,res) => { //Authorizes user
    Authorize_User(req.body,res);
})

app.post('/logout_api',(req,res) => { //Logout user
    Logout(req.body.Session_ID,res);
})

app.post('/Delete_Account',(req,res) => { //Deletes user account
    Delete_Account(req.body.Session_ID,res);
})

app.post('/validate_OTP',(req,res) => {
    Validate_OTP(req.body,res);
});