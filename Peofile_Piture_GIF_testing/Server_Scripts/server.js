//------------------------------------------------------------Node Packages-----------------------------------------------------

//EXPRESS
const express = require("express"); //including express package for creating a server
const path = require("path");
const app = express();
const port = 3000;
app.listen(port); //function called when the server starts listening
app.use(express.static('Public')) //the public folder is what is visible to the client (actually a subset of that folder (depending on the currently rendered webpage and it's used resources))
app.use(express.json({limit : '1mb'} )); //telling that my app will be sending/recieving data in json format (limiting to 1MB)


//FS 
const fs = require("fs");

// //NEDB
// const Datastore = require("nedb"); //including the nedb node package for database 
// const users_database = new Datastore("Database/users.db");
// const logged_in_database = new Datastore("Database/Currently_Logged_in.db");


//------------------------------------------------------------------------------------------------------------------------------


app.post("/me_want_images",(req,res) => {

    // let get = fs.readFileSync("Profile_Pictures/1.gif"); //getting the images from the server as a buffer Array
    // res.sendFile(get);
    app.use(express.static('Public'))
    res.download("Profile_Pictures/1.gif");
})

