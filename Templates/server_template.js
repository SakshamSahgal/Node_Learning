//------------------------------------------------------------Node Packages-----------------------------------------------------

//Dotenv
require("dotenv").config();//reading the .env file

//EXPRESS
const express = require("express"); //including express package for creating a server
const app = express();
const port = process.env.DEV_PORT || 3000
app.listen(port); //function called when the server starts listening
app.use(express.static('public')) //the public folder is what is visible to the client (actually a subset of that folder (depending on the currently rendered webpage and it's used resources))
app.use(express.json({limit : '1mb'} )); //telling that my app will be sending/recieving data in json format (limiting to 1MB)


//FS 
const fs = require("fs");

//NEDB
const Datastore = require("nedb"); //including the nedb node package for database 
const users = new Datastore("Database/users.db");


//------------------------------------------------------------------------------------------------------------------------------

