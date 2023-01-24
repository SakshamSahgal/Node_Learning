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

    function Validate_Session() //Checks if the user is already logged in
    {
        let Session = {
            Session_ID : Cookies.get("Session_ID")
        }

        if(Session.Session_ID != undefined )
        {
            let Server_Response = SendToServer(Session,"/validate_session_api");
            Server_Response.then((response)=>{
                console.log(response);
                if(response.Status == "Invalid Session")
                {
                    Cookies.remove("Session_ID");
                    location.href = "./logged_out.html";
                }
            });
        }
        else
        {
            console.log('Session ID not set');
            location.href = "./index.html";
        }
    }

    function Logout()
    {
         if(Cookies.get("Session_ID") == undefined)
            location.href = "./index.html";
         else
         {
            let Session_Data = {
                Session_ID : Cookies.get("Session_ID")
            }

            let Server_Response = SendToServer(Session_Data,"/logout_api");
            Server_Response.then((response)=>{
                console.log(response);
                if(Cookies.get("Session_ID") != undefined)
                    Cookies.remove("Session_ID");
                    location.href = "./index.html";
            })
        }
    }


    function Delete_Account()
    {
        let Session = {
            Session_ID : Cookies.get("Session_ID")
        }

        SendToServer(Session,"/Delete_Account").then((response)=>{
            console.log(response);
            Cookies.remove("Session_ID");
            if(response.Status == "Invalid Session")
                location.href = "./logged_out.html";
            else
                location.href = "./index.html"; //successfully deleted account
        })
    }

    Validate_Session();
