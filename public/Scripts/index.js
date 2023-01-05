if( 'geolocation' in navigator)
{
    console.log("Geolocation is available");
    navigator.geolocation.getCurrentPosition(async function(position)
    {
        console.log(position);
        document.getElementById("latitude").innerHTML = position.coords.latitude;
        document.getElementById("longitude").innerHTML = position.coords.longitude;


        const data = { //JSON object that the client will send
            lat : position.coords.latitude ,
            long :  position.coords.longitude
        }

        const options = { //the JSON object that client is sending to server
            method : "POST" , 
            headers: {
                'Content-Type' : 'application/json' //specifying that we are sending a JSON object
            } ,
            body : JSON.stringify(data)
        }

        const response = await fetch('/api',options); //sending options JSON to server and getting the response from server back
        const recieved_json = await response.json(); //converting that response to json 
        console.log(recieved_json)  //printing server response

    });
}
else
    console.log("geolocation is not available");