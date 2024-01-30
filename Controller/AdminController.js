const Trainer=require('../Model/TrainerModel')
const Member=require('../Model/MemberModel')
const Booking=require('../Model/BookingModel')
const Service=require('../Model/ServiceModel')
const Testimonial=require('../Model/TestimonialModel')
const Token=require('../Model/TokenModel')
const utility=require('../Utility/authHelper')
const bcryptjs = require('bcryptjs')
const Jwt = require('jsonwebtoken')
const crypto = require('crypto')

// const index=(req,res)=>{
//     res.render("adminDashboard", {
//         title: "admindashboard",
//         // data: req.admin
//     });
// }

const index=async(req,res)=>{
    try {
        

        const AllMember = await Member.countDocuments({
            isAdmin: "member",
        });
        const AllService = await Service.countDocuments()
        const AllTrainer = await Trainer.countDocuments()
        const AllTestimonial = await Testimonial.countDocuments()
        const AllBookings = await Booking.countDocuments()
        

        res.render("adminDashboard", {
            AllMember:AllMember,
            AllService:AllService,
            AllTrainer:AllTrainer,
            AllTestimonial:AllTestimonial,
            AllBookings:AllBookings,

            data: req.admin
        });
    } catch (error) {
        
    }
    
}

const bookingDetailsData=async(req,res)=>{
    const bookingData= await Booking.find().populate("memberId").populate("serviceId")
    res.render("bookingDetails", {
        title: "bookingDetails",
        booking: bookingData,
        data: req.admin
    });
}


const approve = async (req, res) => {
    try {
        const bookingData = await Booking.findById(req.params.id);
        bookingData.isPending = false;
        await bookingData.save()
        res.redirect("/admin/bookings")
    }
    catch (error) {
        console.log(error);
    }
}

const disapprove = async (req, res) => {
    try {
        const bookingData = await Booking.findById(req.params.id);
        bookingData.isPending = true;
        await bookingData.save()
        res.redirect("/admin/bookings")
    }
    catch (error) {
        console.log(error);
    }
}



const getTrainer=async(req,res)=>{
    const trainerData= await Trainer.find()
    res.render("trainer", {
        title: "trainerpage",
        result:trainerData,
        data: req.admin
    });
}

const addTrainer=async(req,res)=>{
    res.render("addTrainer", {
        title: "addtrainerpage",
        data: req.admin
    });
}

const postTrainer = async (req, res) => {
    try {
        const Trainerdata = new Trainer({
            name: req.body.name,
            speciality: req.body.speciality,
            experience: req.body.experience,
            image: req.file.path
        });
        await Trainerdata.save();
        res.redirect("/admin/trainer")
    }
    catch (error) {
        console.log(error);
        req.flash("message", "Error!");
        res.redirect("/admin/getaddTrainer")
    }
}

const getEditTrainer=(req,res)=>{
    const id = req.params.id
    Trainer.findById(id).then((data) => {
        console.log(data);
        res.render('editTrainer', {
            title: "editpage",
            responseData: data,
            data: req.admin
        })

    }).catch((err) => {
        console.log(err);
    })
}

const updateTrainer=(req,res)=>{
    const id=req.body.trainer_id
    Trainer.findById(id).then((result) => {
        result.name = req.body.name
        result.speciality = req.body.speciality
        result.experience = req.body.experience

        if (req.file) {
            result.image = req.file.path;
        }
        return result.save().then(results => {
            res.redirect('/admin/trainer')
            console.log(results, "update successfully")
        })
    }).catch(err => {
        console.log(err, "update failed-")
    })
}

const trainerDelete=(req,res)=>{
    Trainer.deleteOne({_id:req.params.id}).then((del)=>{
        res.redirect('/admin/trainer')
    }).catch((err)=>{
        console.log(err,"delete failed")
    })
}

const trainerActivate=(req,res)=>{
    const id=req.params.id
    Trainer.findById(id).then((data)=>{
        data.status='0'
        return data.save().then(result=>{    
            res.redirect('/admin/trainer')
            console.log(result,"Blog activate successfully")
        })
    }).catch(err=>{
        console.log(err,"activation failed")
    })
}

const trainerDeactivate=(req,res)=>{
    const id=req.params.id
    Trainer.findById(id).then((data)=>{
        data.status='1'
        return data.save().then(result=>{    
            res.redirect('/admin/trainer')
            console.log(result,"Blog deactivate successfully")
        })
    }).catch(err=>{
        console.log(err,"deactivation failed")
    })
}

// ****authentication**** Register****
const registerForm=(req,res)=>{
    res.render("adminRegister",{
        title:"loginpage"
    })
    }

const createRegister=async(req,res)=>{
    try {
        const passwordHash = await utility.securePassword(req.body.password)
        const memberdata = new Member({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            answer: req.body.answer,
            image: req.file.path,
            password: passwordHash
        })
        memberdata.save()
            .then(
                member => {
                    const token_model = new Token({
                        memberId: member._id,
                        token: crypto.randomBytes(16).toString('hex')
                    })
                    token_model.save()
                        .then(
                            token => {
                                const senderEmail = process.env.EMAIL;
                                const password = process.env.PASSWORD;
                                var transporter = utility.transport(senderEmail, password)
                                var mailoptions = {
                                    from: 'no-reply@anisha.com',
                                    to: member.email,
                                    subject: 'Account Verification',
                                    text: 'Hello ' + req.body.name + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/admin\/confirmation\/' + member.email + '\/' + token.token + '\n\nThank You!\n'
                                }
                                utility.mailSender(req, res, transporter, mailoptions);
                            }
                        ).catch(err => {
                            console.log("error while creating token", err);
                        })
                }
            )
        // console.log(data);

    } catch (error) {
        req.flash('message2', "member registration failed");
        res.redirect('/admin/registerform');
    }
}

const confirmaton = (req, res) => {
    Token.findOne({ token: req.params.token })
        .then(token => {
            if (!token) {
                console.log("verification link may be expired");
            } else {
                Member.findOne({ _id: token.memberId, email: req.params.email })
                    .then(member => {
                        if (!member) {
                            req.flash("message1", "member not found")
                            res.redirect("/admin/loginform")
                        } else if (member.isVerified) {
                            req.flash("message1", "member is already verified");
                        } else {
                            member.isVerified = true;
                            member.save()
                                .then((result) => {
                                    req.flash("message1", "member verifed successFully")
                                    res.redirect("/admin/loginform")
                                }).catch((err) => {
                                    console.log("somthing went wrong", err);
                                });
                        }
                    }).catch(err => {
                        console.log("error while finding member", err);
                    })
            }
        }).catch(err => {
            console.log("error while finding token", err);
        })
}

const loginForm=(req,res)=>{
res.render("adminLogin",{
    title:"loginpage",
    message:req.flash("message")
})
}

const loginPost=async(req,res)=>{
    try {
        const data = await Member.findOne({
        email: req.body.email
        })
        if (data) {
            if (data.isAdmin == "admin") {
                const pwd = data.password;
                if (bcryptjs.compareSync(req.body.password, pwd)){
                    const token = Jwt.sign({
                        _id: data._id,
                        name: data.name,
                        email: data.email,
                        phone: data.phone,
                        image: data.image,
                    }, process.env.JWT_SECRET2, { expiresIn: "1d" });
                    res.cookie('adminToken', token)
                    res.redirect('/admin');
                    console.log(data);
                } else {
                    req.flash('message', "Password Does Not Match")
                    res.redirect('/admin/loginform')
                }
            } else {
                req.flash('message', "Email Does Not Exist")
                res.redirect('/admin/loginform')
            }
        }

    } catch (error) {
        console.log(error);
    }
}

const logoutAdmin=(req,res)=>{
    res.clearCookie("adminToken");
    res.redirect('/admin/loginform')
}

const adminAuth = (req, res, next) => {
    if (req.admin) {
        console.log(req.admin);
        next()
    } else {
        res.redirect("/admin/loginform");
    }
}

module.exports={
    index,
    bookingDetailsData,
    approve,
    disapprove,
    getTrainer,
    addTrainer,
    postTrainer,
    getEditTrainer,
    updateTrainer,
    trainerDelete,
    trainerActivate,
    trainerDeactivate,
    loginForm,
    loginPost,
    registerForm,
    createRegister,
    confirmaton,
    logoutAdmin,
    adminAuth
}