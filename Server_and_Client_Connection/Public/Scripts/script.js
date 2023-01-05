function SendToServer()
{
    const Obj_To_Send = {
        data : document.getElementById("data").value
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