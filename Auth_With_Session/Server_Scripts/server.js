//----------------------Node Packages-----------------------------------
const { response } = require("express");
const express = require("express"); //including express package for creating a server
const app = express();
const {Register_User,Logged_In,Authorize_User,Logout} = require("./User_Auth") //for using User Auth Script

//-----------------------------------------------------initialization-----------------------------------------------------------

//EXPRESS
const port = 3000;
app.listen(port); //function called when the server starts listening
app.use(express.static('Public')) //the public folder is what is visible to the client (actually a subset of that folder (depending on the currently rendered webpage and it's used resources))
app.use(express.json({limit : '1mb'} )); //telling that my app will be sending/recieving data in json format (limiting to 1MB)

//------------------------------------------------------------------------------------------------------------------------------

app.get('/api',(request,response) =>{
  
    //response.json({msg : "mai server hu!"});

});

app.post('/logged_in_api',(req,res) => { //checks if session cookie is valid
    Logged_In(req.body.Session_ID,res);
})

app.post('/auth_api',async (req,res) => { //Authorizes user
    Authorize_User(req.body,res);
})

//this method gets data from the client to the server
app.post('/register_api',(req,res) => { //request is a parameter that gets what the client sends
    Register_User(req.body,res);
})

app.post('/logout_api',(req,res) => {
    Logout(req.body.Session_ID,res);
})