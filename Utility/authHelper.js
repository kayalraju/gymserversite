const bcrypt=require('bcryptjs')
const nodemailer=require('nodemailer')


const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error);
    }
}

const transport = (senderEmail, password) => {
    var transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth:{
          user:senderEmail,
          pass:password,
      }
    });
    return transporter
  };
  
  const mailSender =(req,res,trans,mailoptions)=>{
      trans.sendMail(mailoptions,(err)=>{
          if(err){
              console.log("Technical Issue",err);
          }else{
              req.flash("message1","A Verfication Email Sent To Your Mail ID.... Please Verify By Click The Link.... It Will Expire By 24 Hrs...")
              res.redirect("/admin/loginform")
          }
      })
  }

module.exports={
    securePassword,
    transport,
    mailSender
}