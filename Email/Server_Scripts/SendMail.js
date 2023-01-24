var nodemailer = require('nodemailer'); //using Node Mailer Module


const SendMail = async (otp,res) => { //function that sends email 

    console.log(otp);
    console.log("I am sending mail");
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'user.abuser.anonymous@gmail.com',
          pass: 'abniwwppazpfnuhi' //I am using App password (enabled 2 step verification first)
        },
      });
      
      var mailOptions = {
        from: 'user.abuser.anonymous@gmail.com',
        to: 'sakshamsahgal5@gmail.com',
        subject: 'OTP verification',
        text: otp + " is your OTP , it is only valid for 5 minutes"
      };
      
        transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          console.log("Message sent : %s" , info.messageId);    
          //res.json(info);
        }
      });
}

module.exports = SendMail;
