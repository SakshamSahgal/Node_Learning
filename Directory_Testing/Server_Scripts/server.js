//------------------------------------------------------------Node Packages-----------------------------------------------------
const express = require("express"); //including express package for creating a server
const app = express();
const fs = require("fs");
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

    var verdict = {}

    if(fs.existsSync(data.dir)) //if directory exists
        verdict.status = "The directory Already Exists";
    else
    {
        fs.mkdirSync(data.dir,{ recursive: true, force: true });
        verdict.status = "Successfully Created Directory";
    }
    
    res.json(verdict);

});

app.post('/delete_directory',(req,res) => {

    const data = req.body;
    console.log("dir to delete = " + data.dir);

    let verdict = {}

    if(fs.existsSync(data.dir)) //if directory exists
    {
        console.log("dir deleting");
        fs.rmSync(data.dir, { recursive: true, force: true }) //recurcive true because we want to delete all files and folders inside also
        verdict.status = "Successfully Deleted Directory";
    }
    else
        verdict.status = "Directory doesnt exists";

    res.json(verdict);
});