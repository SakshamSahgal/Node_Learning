//EXPRESS
const express = require("express"); //including express package for creating a server
const app = express();
const port = process.env.DEV_PORT || 3000
app.listen(port); //function called when the server starts listening
app.use(express.static('Public')) //the public folder is what is visible to the client (actually a subset of that folder (depending on the currently rendered webpage and it's used resources))
app.use(express.json({limit : '1mb'} )); //telling that my app will be sending/recieving data in json format (limiting to 1MB)

app.get("/getit",(req,res) => {
    console.log(req.headers.authorization);
    res.json({get_ok : "get response from server"});
})


app.post("/postit",(req,res) => {
    console.log(req.headers.authorization);
    console.log(req.body);
    res.json({post_ok : "post response from server"})
})

app.put("/putit",(req,res) => {
    console.log(req.headers.authorization);
    console.log(req.body);
    res.json({put_ok : "put response from server"})
})

app.delete("/deleteit",(req,res) => {
    console.log(req.headers.authorization);
    // /console.log(req.body);
    res.json({delete_ok : "delete response from server"})
})