
    
    let loadOverlay = document.getElementById("Load_overlay");
    let Profile_Picture_Pallet =  document.getElementById("profile_picture_pallet");
  
    

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
        let Session = {
            Session_ID : Cookies.get("Session_ID")
        }

        if(Session.Session_ID == undefined)
            location.href = "./index.html";
        else
        {
            loadOverlay.hidden = false;
            let Server_Response = SendToServer(Session,"/logout_api");
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
        
        let Session = {
            Session_ID : Cookies.get("Session_ID")
        }

        if(Session.Session_ID == undefined)
            location.href = "./index.html";
        else
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
        
    }


    function Get_Profile_Data()
    {
        let Session = {
            Session_ID : Cookies.get("Session_ID")
        }

        if(Session.Session_ID == undefined)
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

    function Change_Profile_Picture()
    {  
        let Session = {
            Session_ID : Cookies.get("Session_ID")
        }
        
        if(Session.Session_ID == undefined)
            location.href = "./index.html";
        else
        {
            Profile_Picture_Pallet.hidden = false;
            loadOverlay.hidden = false; //revealing the loadOverlay
            SendToServer(Session,"/fetch_Profile_Pictures_api").then((response) => {
                loadOverlay.hidden = true; //Hiding the loadOverlay
                console.log(response);

                if(response.Status != "Pass")
                    location.href = "./logged_out.html";
                else
                {
                    let in_this_row = 0; //variable to count no of images in a row
                    let Inner_Profile_Pallet = document.getElementById("inner_pallet");
                    let this_container = document.createElement("div"); //creating container div
                    this_container.classList.add("container"); 
                    this_container.classList.add("py-5");

                    let this_row = document.createElement("div");
                    this_row.classList.add("row");
                    this_row.classList.add("g-3");

                    for(var i=0;i<response.Paths.length;i++)
                    {
                        let this_col = document.createElement("div"); //creating a col div
                        this_col.classList.add("col-md-4"); //Adding Bootstrap CSS
                        this_col.classList.add("rounded"); //Adding Bootstrap CSS
                        this_col.classList.add("p-3"); //Adding Bootstrap CSS

                        let img_holder_div = document.createElement("div");
                        img_holder_div.classList.add("p-3"); //padding 3 to the image holder div
                        img_holder_div.classList.add("border");
                        img_holder_div.classList.add("rounded");
                                                        
                        //img_holder_div.classList.add("bg-dark"); //adding color to the holder div
                        //img_holder_div.classList.add("bg-gradient"); //adding color to the holder div
                        img_holder_div.align = "center";

                        let this_img = document.createElement("img");
                        this_img.src = response.Paths[i];
                        this_img.style.maxWidth = "100%";
                        this_img.style.maxHeight = "100%";

                        img_holder_div.appendChild(this_img);
                        this_col.appendChild(img_holder_div);
                        this_row.appendChild(this_col);

                        this_container.appendChild(this_row);
                        in_this_row++;
                        if(in_this_row == 3)
                        {
                            in_this_row = 0;
                            this_row = document.createElement("div");
                            this_row.classList.add("row");
                            this_row.classList.add("g-3");
                        }
                    }
                    Inner_Profile_Pallet.appendChild(this_container);
                }
            });
        }
    }

    Get_Profile_Data();