

axios.get("/get_route").then( response => {

    console.log("get response => ")
    console.log(response.data);
})


let data_to_post = {
    name : "saksham",
    type : "post wala data"
}

axios.post("/post_route",data_to_post).then(response => {

    console.log("post response => ")
    console.log(response.data);
})

let data_to_update ={
    name : "saksham",
    type : "put wala data"
}

axios.put("/put_route",data_to_update).then(response => {
    console.log("put response => ")
    console.log(response.data);
})


axios.delete("/delete_route").then(response => {

    console.log("delete response => ")
    console.log(response.data);
})