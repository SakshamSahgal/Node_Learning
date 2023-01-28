//FS 
const fs = require("fs");

function Save_Image(req,res)
{
    dataURI = req.body.Base64;
    
    const Extension = dataURI.split(';')[0].split('/')[1];
    let base64Data;
    let verdict = {}

    if(Extension == "png" || Extension == "jpg" || Extension == "jpeg" || Extension == "gif")
    {
        if(Extension == "png")
            base64Data = dataURI.replace(/^data:image\/png;base64,/, "");
        else if(Extension == "jpg")
            base64Data = dataURI.replace(/^data:image\/jpg;base64,/, "");
        else if(Extension == "jpeg")
            base64Data = dataURI.replace(/^data:image\/jpeg;base64,/, "");
        else if(Extension == "gif")
            base64Data = dataURI.replace(/^data:image\/gif;base64,/, "");
        
        const fileName = 'decoded-image';
        const path = "Images/" + fileName + "." + Extension;

        fs.writeFileSync(path, base64Data, "base64");

        console.log(Extension);
        verdict.status = "pass";
        verdict.description = "Saved Successfully";
        res.json(verdict);
    }
    else
    {
        console.log(Extension);
        verdict.status = "fail";
        verdict.description = "wrong image type";
        res.json(verdict);
    }
    
}

module.exports = {Save_Image}