//------------------------------------------------------------Node Packages-----------------------------------------------------

//EXPRESS
const express = require("express"); //including express package for creating a server
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

const {upload} = require("./image_upload.js");


app.post("/upload",upload.single("image"),(req,res) => {
    fs.readFile("./Images/Saksham1674716665012.png", 'base64', (err, base64Image) => {
		// 2. Create a data URL 
            //console.log(base64Image);
            const dataUrl = "data:image/png;base64" + base64Image;
            return res.send(`<img src=${dataUrl}>`);
        }
    );
})