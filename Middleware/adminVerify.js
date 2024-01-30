const jwt = require('jsonwebtoken')
const Member=require('../Model/MemberModel')

exports.jwtAuth = (req, res, next) => {
    if (req.cookies && req.cookies.adminToken) {
        jwt.verify(req.cookies.adminToken, process.env.JWT_SECRET2, (err, admin) => {
            req.admin = admin;
            next()
        })
    } else {
        next()
    }
}

exports.checkEmali = (req,res,next)=>{
    Member.findOne({email:req.body.email})
    .then(data =>{
        if(data){
            req.flash("message2","email already exists")
            return res.redirect('/admin/registerform')
        }
        const {name,email,password}=req.body ;
        if(!(name && email && password)){
            req.flash("message2","all inputs are required");
            return res.redirect('/admin/registerform');
        }
        next()
    })
    .catch(err =>{
        console.log(err);
        next();
    })
}



