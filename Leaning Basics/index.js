const express = require("express");
const req = require("express/lib/request");
const res = require("express/lib/response");
const app = express();

console.log("Hi!")


app.listen(3000,() => {
    console.log("listening at port 3000")
}); //function called when the server starts listening

app.use(express.static('public')) //the public folder is what is visible to the client (actually a subset of that folder (depending on the currently rendered webpage and it's used resources))
app.use(express.json({limit : '1mb'} )); //telling that my app will be sending/recieving data in json format (limiting to 1MB)



app.post('/api',(request,response) => { //request is a parameter that gets what the client sends and response sends back to the client
    console.log("hey! i got something from a client!")
    console.log(request.body);
    response.json({
        server_reply : "hey! i am server and i got your latitude and longitude !" , 
        lat : request.body.lat,
        long : request.body.long,
    });
})