const multer = require("multer");


const storage = multer.diskStorage({ //JSON that stores storage information 

    destination : ( req , file , cb ) => {
        cb(null , "./Images" ) //(passing null to error parameter because we dont want to do anything when any error occours )
    },

    filename : (req , file , cb ) => {
        console.log(file);
        filename = "Saksham" + Date.now() + ".png";
        cb(null,filename) //error->NULL filename = filename
    }
})

//const upload = multer({storage : storage}) //middleware

var upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
      }
    }
});

module.exports = {upload};