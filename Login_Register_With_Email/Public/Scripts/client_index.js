
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

function Validate_Session() //checks if the user is already logged in
{
    let Session = {
        Session_ID : Cookies.get("Session_ID")
    }
    if(Session.Session_ID != undefined )
    {
        let Server_Response = SendToServer(Session,"/validate_session_api");
        Server_Response.then((response)=>{
            console.log(response);
            if(response.Status == "Session Matched")
                location.href = "./Dashboard.html";
            else
                Cookies.remove("Session_ID");
        });
    }
    else
        console.log('Session ID not set');
}

function Get_Gender() //this function returns the selected gender
{
    let register_gender = document.getElementsByName("register_gender"); //getting refrence to the group of gender radio button
    let val;
    register_gender.forEach((x)=>{ //Iterating over each radio button to get which is checked 
        if(x.checked == true)
            val =  x.value;
    })
    return val;
}

function Register()
{
    let Register_Credentials = { //getting the crenditials from the input field
        Username : document.getElementById("register_name").value,
        Gender : Get_Gender(),
        Email : document.getElementById("register_email").value,
        Password : document.getElementById("register_pass").value ,
    }

    console.log(Register_Credentials);

    let server_response = SendToServer(Register_Credentials,'/register_api'); //sending to server
    server_response.then((response)=>{
        console.log(response)
        if(response.status == "Success")
            document.getElementById("OTP_Div").hidden = false; //unhiding the OTP div
    });
}

function Log_in() //Logs in User
{
    let Login_Credentials = { //getting the crenditials from the input field
        Username : document.getElementById("login_name").value,
        Password : document.getElementById("login_pass").value
    }

    let server_response = SendToServer(Login_Credentials,'/auth_api');
    server_response.then((response)=>{
        console.log(response);
        if(response.Status == "Pass")
        {
            Cookies.set("Session_ID",response.Session_ID);
            location.href = "./Dashboard.html";
        }
    });
}

function Validate_OTP()
{
    let OTP_data = {
        OTP : document.getElementById("input_OTP").value,
    }

    SendToServer(OTP_data,"/validate_OTP").then((response) => {
        console.log(response);
        if(response.status == "Success")
        {
            alert("Successfully Registered!!");
            location.href = "./index.html";
        }

    });
}

Validate_Session();