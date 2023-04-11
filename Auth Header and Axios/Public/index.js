
async function Send_Post_Request(JSON_to_Send,Route)
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

async function Send_Get_Request(Authorization_ID_to_Send,Route)
{
    let send_package_obj = { //packing it in an object
        method : 'GET',
        headers : {
            'Authorization': Authorization_ID_to_Send,
        },
    }
    let server_response = await fetch(Route,send_package_obj);
    return await server_response.json()
}




Send_Get_Request("auth","/users").then(response => {
    console.log(response);
})

// Send_Post_Request({post : "ppost"},"/users").then(response => {
//     console.log(response);
// })