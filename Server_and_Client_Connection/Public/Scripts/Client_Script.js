
function SendToServer(data_to_send) //function that sends data (string) passed to it to the server
{
    console.log("sending " + data_to_send);
    const Obj_To_Send = {
        data : data_to_send,
        no : 1
    }

    const send_package_obj = {
        method : 'POST' ,
        headers : {
            'Content-Type' : 'application/json' //telling that i am sending a JSON
        } ,
        body : JSON.stringify(Obj_To_Send)
    }
    fetch('/api',send_package_obj);
}


async function Get_From_Server() //function that recieves data from the server
{
    const response = await fetch('/api');
    const data = await response.json();
    console.log(data);
}

Get_From_Server();