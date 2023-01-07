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

//------------------------------------------------------------------------------------------------------------------------------

app.get('/api',(request,response) =>{
  
    //response.json({msg : "mai server hu!"});


});

//this method gets data from the client to the server
app.post('/auth_api',(req,res) => { //request is a parameter that gets what the client sends
  
  console.log(req.body);
  const data_to_find = {
    data : req.body
  }

  const database = new Datastore("Database/users.db");
  database.loadDatabase();
  
  database.find(req.body,(err,data) =>{ //finding in database

      let verdict = {
        status : "fail",
        description : "Not found in Database"
      }

      console.log(data);

      if(data.length == 1)
      {
        verdict.status = "Pass";
        verdict.description = "User found in Database";
        
      }
      res.json(verdict);
    });
    
})

//this method gets data from the client to the server
app.post('/register_api',(req,res) => { //request is a parameter that gets what the client sends
  
  console.log(req.body);
  const data = {
    data : req.body
  }

  //NEDB
  const database = new Datastore("Database/users.db");
  database.loadDatabase();
  database.insert(req.body);
  
  let verdict = {
    status : "Done"
  }

  res.json(verdict);

})