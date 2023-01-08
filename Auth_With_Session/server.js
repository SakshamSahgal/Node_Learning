//----------------------Node Packages-----------------------------------
const express = require("express"); //including express package for creating a server
const app = express();
const Datastore = require("nedb"); //including the nedb node package for database 

//-----------------------------------------------------initialization-----------------------------------------------------------

//EXPRESS
const port = 3000;
app.listen(port); //function called when the server starts listening
app.use(express.static('Public')) //the public folder is what is visible to the client (actually a subset of that folder (depending on the currently rendered webpage and it's used resources))
app.use(express.json({limit : '1mb'} )); //telling that my app will be sending/recieving data in json format (limiting to 1MB)

//NEDB
const users_database = new Datastore("Database/users.db");
//------------------------------------------------------------------------------------------------------------------------------

app.get('/api',(request,response) =>{
  
    //response.json({msg : "mai server hu!"});


});


app.post('/auth_api',(req,res) => { //Authorizes user
  
  console.log(req.body);

  users_database.loadDatabase();
  
  users_database.find(req.body,(err,data) =>{ //finding user in database

      let verdict = {
      }

      console.log(data);

      if(data.length == 1)
      {
        verdict.status = "Pass";
        verdict.Session_ID = Date.now();
      }
      else
      {
        verdict.status = "Fail";
        verdict.descreption = "User not found in DB";
      }
      res.json(verdict);
    });

})

//this method gets data from the client to the server
app.post('/register_api',(req,res) => { //request is a parameter that gets what the client sends

  console.log(req.body);
  //NEDB
  users_database.loadDatabase();
  users_database.find({name : req.body.name},(err,data)=>{

    let verdict = {

    }

    console.log("we found this -> ");
    console.log(data);

    if(data.length == 0)
    {
        users_database.insert(req.body);
        verdict.status = "Done";
    }
    else
    {
        verdict.status = "Fail";
        verdict.descreption = "Username already Exists";
    }

    res.json(verdict);
  })
})