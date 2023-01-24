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

//NEDB
const Datastore = require("nedb"); //including the nedb node package for database 
const db_1 = new Datastore("Database/db_1.db"); //this will create a new db_1 if not already present
const db_2 = new Datastore("Database/db_2.db"); //this will create a new db_2 if not already present


//------------------------------------------------------------------------------------------------------------------------------

app.post('/Fetch_All_Data_api',(req,res) => {
    const data = req.body;
    var result_arr = [];

    db_1.loadDatabase();
    db_2.loadDatabase();
    
    db_1.find({}, function (err, db_1_data) {
        db_2.find({},function(err,db_2_data){
            result_arr.push(db_1_data);
            result_arr.push(db_2_data);
            var returning = {
                fetched_data : result_arr
            }
            res.json(returning);
       })
    });
});

app.post('/Enter_data_api',(req,res) => {
    
     let data = req.body;
     console.log("Entry To Create ");
     console.log(data);
    
    db_1.loadDatabase(); //loading DB1
    db_2.loadDatabase(); //loading DB2

    if(data.db == "db_1")
    {
        console.log("into db1");
        delete data.db;
        db_1.insert(data);
    }
    else
    {
        console.log("into db2");
        delete data.db;
        db_2.insert(data);
    }

    let verdict = {
        status : "successfully Created Entry in DB"
    }

    res.json(verdict);
});
