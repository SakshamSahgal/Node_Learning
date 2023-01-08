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
const logged_in_database = new Datastore("Database/Currently_Logged_in.db");
//------------------------------------------------------------------------------------------------------------------------------

app.get('/api',(request,response) =>{
  
    //response.json({msg : "mai server hu!"});

});

app.post('/logged_in',(req,res) => { //checks if session cookie is valid

        logged_in_database.loadDatabase();
        logged_in_database.find({Session_ID : req.body.Session_ID},(err,data) => { //checking if the user is currently logged in
        
        let verdict = {
        }

        if(data.length == 1)
            verdict.Status = "Logged In";
        else
            verdict.Status = "Not Logged In";

            res.json(verdict);
    })

})

app.post('/auth_api',(req,res) => { //Authorizes user
  
        console.log(req.body);

        users_database.loadDatabase();
        logged_in_database.loadDatabase();


        users_database.find({Username : req.body.Username },(err,user_list) =>{ //finding user in database
            
            console.log("Users matched = ");
            console.log(user_list);

            let verdict = {
            }

            if(user_list.length == 1) //username matches
            {
                if(user_list[0].Password == req.body.Password)
                {
                    logged_in_database.find({Username : req.body.Username},(err,active_list)=> {
                    
                        console.log("Active Users Matched = ");
                        console.log(active_list);
    
                        if(active_list.length == 0) //Not currently Logged in
                        {
                            verdict.Status = "Pass";
                            verdict.Session_ID = Date.now();
                                            
                            let User_Session = {
                                Username : req.body.Username,
                                Session_ID : verdict.Session_ID
                            }     
                            logged_in_database.insert(User_Session);   
                        }
                        else
                        {
                            verdict.Status = "Fail";
                            verdict.Description = "User already Logged in";
                        }
                        res.json(verdict);
                    })
                }
                else
                {
                    verdict.Status = "Fail";
                    verdict.Descreption = "Password Wrong!";
                    res.json(verdict);
                }

            }
            else
            {
                verdict.Status = "Fail";
                verdict.Descreption = "User not found in DB";
                res.json(verdict);
            }
    });

})

//this method gets data from the client to the server
app.post('/register_api',(req,res) => { //request is a parameter that gets what the client sends

  console.log(req.body);
  //NEDB
  users_database.loadDatabase();
  users_database.find({Username : req.body.Username},(err,data)=>{

    let verdict = {
    }

    console.log("we found this -> ");
    console.log(data);

    if(data.length == 0)
    {
        users_database.insert(req.body);
        verdict.status = "User Successfully Registered";
    }
    else
    {
        verdict.status = "Registration Failed";
        verdict.descreption = "Username already Exists";
    }

    res.json(verdict);
  })
})