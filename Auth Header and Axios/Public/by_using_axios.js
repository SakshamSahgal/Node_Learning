
axios.get('/getit', {headers: {'Authorization': 'ye aaiya get ka auth'}}).then(response => {
    console.log(response.data);
})


let data = {
    req : "hi from post client"
}
axios.post('/postit', data, {headers: {'Content-Type': 'application/json','Authorization': 'ye aaiya post ka auth'}}).then(response => {
    console.log(response.data);
})

let data2 = {
    req : "hi from put client"
}

axios.put('/putit',data2,{headers: {'Content-Type': 'application/json','Authorization': 'ye aaiya put ka auth'}}).then(response => {
    console.log(response.data);
})

let data3 = {
    req : "hi from put client"
}

axios.delete('/deleteit',{headers: {'Authorization': 'ye aaiya delete ka auth'}}).then(response => {
    console.log(response.data);
})