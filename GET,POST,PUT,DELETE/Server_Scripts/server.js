const express = require("express"); //importing the express module[npm package]
const app = express(); //creating an instance [object] of the express application to use get,put,post,delete
app.use(express.static('Public')) //serves static files from the public directory on HTTP get requests
app.use(express.json()); //when client sends json data , it automatically parses that into javascript object

const port = 3000

app.listen(port); //starts the server on port 3000

app.get("/get_route",(req,res) => {
    
    console.log("get request => ")
    console.log(req.body);

    let json_to_send={
        Decription : "this is get response"
    }
    res.json(json_to_send);
})

app.post("/post_route",(req,res) => {

    console.log("post request => ")
    console.log(req.body);

    let verdict={
        Decription : "this is post response"
    }

    res.json(verdict);
})

app.put("/put_route",(req,res) => {

    console.log("put request => ")
    console.log(req.body);

    let verdict={
        Decription : "this is put response"
    }

    res.json(verdict);

})

app.delete("/delete_route",(req,res) => {

    console.log("delete request => ")
    console.log(req.body);

    let verdict={
        Decription : "this is delete response"
    }

    res.json(verdict);

})
