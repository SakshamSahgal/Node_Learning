
async function SendToServer(JSON_to_Send,Route)
{
        let send_package_obj = { //packing it in an object
        method : 'POST' ,
        headers : {
            'Content-Type' : 'application/json' //telling that i am sending a JSON
        } ,
        body : JSON.stringify(JSON_to_Send)
        }
    
        let server_response = await fetch(Route,send_package_obj);
        return await server_response.json();
}

function Authenticate()
{
    let Login_Credentials = { //getting the crenditials from the input field
        name : document.getElementById("login_name").value,
        pass : document.getElementById("login_pass").value
    }

    let server_response = SendToServer(Login_Credentials,'/auth_api');
    server_response.then((response)=>console.log(response));
}

function Register()
{
    let Register_Credentials = { //getting the crenditials from the input field
        name : document.getElementById("register_name").value,
        pass : document.getElementById("register_pass").value
    }

    if(Register_Credentials.name != "" && Register_Credentials.pass != "")
    {
        let server_response = SendToServer(Register_Credentials,'/register_api');
        server_response.then((response)=>console.log(response));
    }
}