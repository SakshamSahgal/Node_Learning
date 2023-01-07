//----------------------Node Packages-----------------------------------
const { response } = require("express");
const express = require("express"); //includiing express package for creating a server
const req = require("express/lib/request");
const res = require("express/lib/response");
const app = express(); 
const Datastore = require("nedb"); //including the nedb node package for database 
//-----------------------------------------------------------------


const database = new Datastore("database.db"); //database variable is pointing to database.db (it will create it if it is not there locally)
database.loadDatabase(); //loading

 //function called when the server starts listening
app.listen(3000,() => { 
    console.log("listening at port 3000")
});

app.use(express.static('Public')) //the public folder is what is visible to the client (actually a subset of that folder (depending on the currently rendered webpage and it's used resources))
app.use(express.json({limit : '1mb'} )); //telling that my app will be sending/recieving data in json format (limiting to 1MB so no flooding the server)


app.get('/api',(request,response) =>{
  
  database.find({},(err,data) => {
    response.json(data); //send that data that is fetched from the database (here everything in database)
  })
});

//this method gets data from the client to the server
app.post('/api',(request,response) => { //request is a parameter that gets what the client sends and response sends back to the client
  console.log("server got = ");
  console.log(request.body);
  const data = {
    data : request.body.data,
    no : request.body.no
  }
  database.insert(data);
})