let loadOverlay = document.getElementById("Load_overlay");
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

    function Fetch_Profile_Page()
    {
        let req_json = {
            Session_ID : Cookies.get("Session_ID") ,
            Username : ((window.location.href).split("/")[4]).split(".")[0]
        }
        
        console.log(req_json);

        if(req_json.Session_ID == undefined)
            location.href = location.href = "../index.html";
        else
        {
            loadOverlay.hidden = false; //revealing the load overlay

            SendToServer(req_json,"/Fetch_Profile_api").then((response) => {
                console.log(response);
                loadOverlay.hidden = true; //hiding the load overlay
                if(response.Status == "Pass")
                {
                    document.getElementById("Profile_Photo").src = "../" + response.Profile_Picture;
                    document.getElementById("Username").textContent = response.Username;
                    document.getElementById("user_bio").textContent = response.Bio;
                    document.getElementById("User_Gender").textContent = response.Gender;
                    document.getElementById("User_Email").textContent = response.Email;
                    document.getElementById("Activity_Status").textContent = response.Activity_Status;
                    if(response.Activity_Status == "Online")
                        document.getElementById("Activity_Status").style="color: green;";
                    else
                        document.getElementById("Activity_Status").style="color: red;";
                }
                else
                {
                    if(response.Description == "You are accessing your own profile")
                        location.href = "../Profiles.html";
                }
            })
        }
    }

    Fetch_Profile_Page();