const express = require("express")
const app = express()

app.use(express.static('public'))
const port = 3000

let arr = [
    {data : 'a'},
    {data : 'b'},
    {data : 'c'},
    {data : 'd'},
]


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

app.get("/ye",(req,res) => {
    res.json({yelo : "yelo beta"}); 
})

app.delete()