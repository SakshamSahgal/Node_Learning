//------------------------------------------------------------Node Packages-----------------------------------------------------
const { response } = require("express");
const express = require("express"); //including express package for creating a server
const app = express();
const {Register_User,Logged_In,Authorize_User} = require("./Auth") //for using User Auth Script

//-----------------------------------------------------initialization-----------------------------------------------------------

//EXPRESS
const port = 3000;
app.listen(port); //function called when the server starts listening
app.use(express.static('Public')) //the public folder is what is visible to the client (actually a subset of that folder (depending on the currently rendered webpage and it's used resources))
app.use(express.json({limit : '1mb'} )); //telling that my app will be sending/recieving data in json format (limiting to 1MB)



//------------------------------------------------------------------------------------------------------------------------------


app.post('/validate_session_api',(req,res) => { //checks if session cookie is valid
    Validate_Session(req.body.Session_ID,res);
})