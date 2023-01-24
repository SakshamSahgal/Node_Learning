//------------------------------------------------------------Node Packages-----------------------------------------------------
const express = require("express"); //including express package for creating a server
const app = express();
const fs = require("fs");
const {Create_Directory,Delete_Directory} = require("./directories.js") //for using User Directory Management Script
//-----------------------------------------------------initialization-----------------------------------------------------------

//EXPRESS
const port = 3000;
app.listen(port); //function called when the server starts listening
app.use(express.static('Public')) //the public folder is what is visible to the client (actually a subset of that folder (depending on the currently rendered webpage and it's used resources))
app.use(express.json({limit : '10mb'} )); //telling that my app will be sending/recieving data in json format (limiting to 1MB)

//------------------------------------------------------------------------------------------------------------------------------


app.post('/make_directory',(req,res) => {
    const data = req.body;
    console.log("dir to create = " + data.dir);
    res.json(Create_Directory(data.dir));
});

app.post('/delete_directory',(req,res) => {
    const data = req.body;
    console.log("dir to delete = " + data.dir);
    res.json(Delete_Directory(data.dir));
});