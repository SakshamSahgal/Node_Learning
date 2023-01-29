    
    let loadOverlay = document.getElementById("Load_overlay");
    let Session = {
        Session_ID : Cookies.get("Session_ID")
    }

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

    function Logout()
    {
         if(Cookies.get("Session_ID") == undefined)
            location.href = "./index.html";
         else
         {
            let Session_Data = {
                Session_ID : Cookies.get("Session_ID")
            }
            loadOverlay.hidden = false;
            let Server_Response = SendToServer(Session_Data,"/logout_api");
            Server_Response.then((response)=>{
                loadOverlay.hidden = true;
                console.log(response);
                if(Cookies.get("Session_ID") != undefined)
                    Cookies.remove("Session_ID");
                    location.href = "./index.html";
            })
        }
    }


    function Delete_Account()
    {
        loadOverlay.hidden = false;
        SendToServer(Session,"/Delete_Account").then((response)=>{
            loadOverlay.hidden = true;
            console.log(response);
            Cookies.remove("Session_ID");
            if(response.Status == "Invalid Session")
                location.href = "./logged_out.html";
            else
                location.href = "./index.html"; //successfully deleted account
        })
    }


    function Get_Profile_Data()
    {
        if(Cookies.get("Session_ID") == undefined)
            location.href = "./index.html";
        else
        {
            loadOverlay.hidden = false;
            SendToServer(Session,"/Profile_Page_api").then((response) => {
                loadOverlay.hidden = true;
                console.log(response);
                if(response.Status != "Pass")
                    location.href = "./logged_out.html";
                else
                {
                    document.getElementById("Profile_Photo").src = response.Profile_Picture;
                    document.getElementById("user_bio").textContent = response.Bio;
                    document.getElementById("User_Gender").textContent = response.Gender;
                }
            })

        }
    }


    Get_Profile_Data();