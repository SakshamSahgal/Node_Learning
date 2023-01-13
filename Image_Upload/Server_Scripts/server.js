//------------------------------------------------------------Node Packages-----------------------------------------------------
const { response } = require("express");
const express = require("express"); //including express package for creating a server
const app = express();
const fs = require("fs"); //using file system for storing images

//-----------------------------------------------------initialization-----------------------------------------------------------

//EXPRESS
const port = 3000;
app.listen(port); //function called when the server starts listening
app.use(express.static('Public')) //the public folder is what is visible to the client (actually a subset of that folder (depending on the currently rendered webpage and it's used resources))
app.use(express.json({limit : '10mb'} )); //telling that my app will be sending/recieving data in json format (limiting to 1MB)

//------------------------------------------------------------------------------------------------------------------------------


app.post('/upload',(req,res) => {

    const data = req.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    data.image_file = `image_${timestamp}.png`;
    const base64Data = data.base64.replace(/^data:image\/png;base64,/, "");

    var path = "images/" + data.Username;
   
    ensureDirectoryExistence(path);
    
    path = path + "/" + data.image_file;

    console.log("path = " + path);

    fs.writeFileSync(path, base64Data, "base64");
    delete data.base64;

    console.log(data);

    let verdict = {
        status : "Successfully Saved"
    }
    res.json(verdict);

});

function ensureDirectoryExistence(dirname) { //function that makes the directory if it doesn't exist
    if (fs.existsSync(dirname)) {
      console.log("Yes Directory already exists");
    }else
    fs.mkdirSync(dirname);
  } 