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
        return await server_response.json()
}

function Is_Logged_In() //checks if the user is already logged in
{
    let Session = {
        Session_ID : Cookies.get("Session_ID")
    }
    if(Session.Session_ID != undefined )
    {
        let Server_Response = SendToServer(Session,"/logged_in_api");
        Server_Response.then((response)=>{
            console.log(response);
            if(response.Status == "Valid (Already Logged In)")
                location.href = "./Dashboard.html";
        });
    }
    else
        console.log("Session ID not set");
}

function Log_in() //Logs in User
{
    let Login_Credentials = { //getting the crenditials from the input field
        Username : document.getElementById("login_name").value,
        Password : document.getElementById("login_pass").value
    }

    if(Login_Credentials.Username != "" && Login_Credentials.Password != "")
    {
        let server_response = SendToServer(Login_Credentials,'/auth_api');
        server_response.then((response)=>{
            console.log(response);
            if(response.Status == "Pass")
                Cookies.set("Session_ID",response.Session_ID);
                location.href = "./Dashboard.html"
        });
    }
    else
        alert("You cant leave fields empty");    
}

function Register()
{
    let Register_Credentials = { //getting the crenditials from the input field
        Username : document.getElementById("register_name").value,
        Password : document.getElementById("register_pass").value
    }

    if(Register_Credentials.Username != "" && Register_Credentials.Password != "")
    {
        let server_response = SendToServer(Register_Credentials,'/register_api');
        server_response.then((response)=>console.log(response));
    }
    else
        alert("You cant leave fields empty");    
}


Is_Logged_In()