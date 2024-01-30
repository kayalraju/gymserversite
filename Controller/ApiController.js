const Banner = require('../Model/BannerModel')
const Trainer = require('../Model/TrainerModel')
const Service = require('../Model/ServiceModel')
const Testimonial = require('../Model/TestimonialModel')
const Blog=require('../Model/BlogModel')
const Token = require('../Model/TokenModel')
const Member = require('../Model/MemberModel')
const Booking = require('../Model/BookingModel')
const utility = require('../Utility/authHelper')
const bcryptjs = require('bcryptjs')
const Jwt = require('jsonwebtoken')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

const createRegister = async (req, res) => {
    try {
        const passwordHash = await utility.securePassword(req.body.password);
        let memberdata = new Member({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            answer: req.body.answer,
            image: req.file.path,
            password: passwordHash
        });
        const data = await Member.findOne({ email: req.body.email });
        if (!req.body.name || !req.body.email || !req.body.phone || !req.body.password || !req.body.answer) {
            return res.status(400).json({
                success: false,
                message: "all fields are required!"
            })
        } else {
            if (data) {
                return res.status(400).json({
                    success: false,
                    message: "Member already exists!"
                })
            } else {
                memberdata.save()
                    .then(savedMember => {
                        const token_model = new Token({
                            memberId: savedMember._id,
                            token: crypto.randomBytes(16).toString('hex')
                        });

                        token_model.save()
                            .then(token => {
                                var transporter = nodemailer.createTransport({
                                    host: "smtp.gmail.com",
                                    port: 587,
                                    secure: false,
                                    requireTLS: true,
                                    auth: {
                                        user: "anishab163@gmail.com",
                                        pass: "btyi yvac avkj bypy",
                                    }
                                });

                                var mailoptions = {
                                    from: 'no-reply@anisha.com',
                                    to: savedMember.email,
                                    subject: 'Account Verification',
                                    text: 'Hello ' + req.body.name + ',\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + encodeURIComponent(savedMember.email) + '\/' + encodeURIComponent(token.token) + '\n\nThank You!\n'
                                };


                                transporter.sendMail(mailoptions, (error, info) => {
                                    if (error) {
                                        console.log("Error sending email:", error);
                                        return res.status(400).json({
                                            success: false,
                                            message: "Error sending verification email!"
                                        });
                                    }

                                    console.log("Email sent:", info.response);
                                    const imageUrl = `${req.protocol}://${req.get("host")}/${savedMember.image}`;
                                    return res.status(200).json({
                                        success: true,
                                        message: "Verification link sent!",
                                        savedMember
                                    });
                                });
                            })
                            .catch(err => {
                                console.log("Error while creating token", err);
                                return res.status(400).json({
                                    success: false,
                                    message: "Token save error!"
                                });
                            });
                    });
            }
        }
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            success: false,
            message: error.message || "Member registration failed"
        });
    }
};

const confirmaton = (req, res) => {
    Token.findOne({ token: req.params.token })
        .then(token => {
            if (!token) {
                console.log("verification link may be expired");
            } else {
                Member.findOne({ _id: token.memberId, email: req.params.email })
                    .then(member => {
                        if (!member) {
                            return res.status(400).json({
                                status: 400,
                                message: "member doesnt exist!"
                            })
                        } else if (member.isVerified) {
                            return res.status(400).json({
                                status: 400,
                                message: "member is already verified!"
                            })
                        } else {
                            member.isVerified = true;
                            member.save()
                            return res.status(200).json({
                                status: 200,
                                message: "member is verified!"
                            })
                        }
                    }).catch(error => {
                        return res.status(400).json({
                            status: 400,
                            message: "error finding member", error
                        })
                    })
            }
        }).catch(error => {
            return res.status(400).json({
                status: 400,
                message: "error finding token", error
            })
        })
}

const loginPost = async (req, res) => {
    try {
        const data = await Member.findOne({
            email: req.body.email
        });

        if (!data) {
            return res.status(400).json({
                status: 400,
                message: "Member doesn't exist!",
            });
        }

        if (!data.isVerified) {
            return res.status(400).json({
                status: 400,
                message: "Member is not verified!",
            });
        }

        if (data.isAdmin !== "member") {
            return res.status(400).json({
                status: 400,
                message: "Only member can login here!",
            });
        }
        const pwd = data.password;
        if (!bcryptjs.compareSync(req.body.password, pwd)) {
            return res.status(400).json({
                status: 400,
                message: "Incorrect password!",
            });
        }
        const token = Jwt.sign(
            {
                _id: data._id,
                name: data.name,
                email: data.email,
                phone: data.phone,
                image: data.image,
            },
            process.env.JWT_SECRET2,
            { expiresIn: "60d" }
        );

        res.cookie("memberToken", token);

        return res.status(200).json({
            status: 200,
            data,
            token,
            message: "Login Successful",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
        });
    }
};


const logoutMember = (req, res) => {
    res.clearCookie("memberToken");
    res.json({
        success: true,
        message: "Member logout successful",
    });
}

const viewBanner = async (req, res) => {
    try {
        const bannerData = await Banner.find()
        return res.status(200).json({
            success: true,
            message: "Data Found",
            data: bannerData
        })
    } catch (err) {
        return res.status(404).json({
            success: false,
            message: "no data found"
        })
    }
}

const addBannerData = async (req, res) => {
    // const files = req.files
    // let imagesPaths = [];
    // const basePath = `${req.protocol}://${req.get('host')}/uploads/`;
    // if(files) {
    //    files.map(file =>{
    //        imagesPaths.push(`${basePath}${file.filename}`);
    //    })
    // }
    let bannerModel = new Banner({
        title: req.body.title,
        subtitle: req.body.subtitle,
        image: req.file.path,
    })

    const banner = await bannerModel.save();

    if (!banner) {
        return res.status(500).send(
            {
                message: "Banner can not be create"
            }
        )
    } else {
        return res.status(200).send({
            data: banner,
            message: "Banner data added successfully"
        })
    }
}

const addTrainer = async (req, res) => {
    try {
        const result = new Trainer({
            name: req.body.name,
            speciality: req.body.speciality,
            experience: req.body.experience,
            image: req.file.path,
        })
        const output = await result.save();
        res.status(200).json({
            success: true,
            message: 'tainer data created!',
            data: output
        })
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'error'
        })
    }
}

const viewTrainer = async (req, res) => {
    try {
        const trainerData = await Trainer.find()
        return res.status(200).json({
            success: true,
            message: "Data Found",
            data: trainerData
        })
    } catch (err) {
        return res.status(404).json({
            success: false,
            message: "no data found"
        })
    }
}

const addService = async (req, res) => {
    try {
        const result = new Service({
            service_name: req.body.service_name,
            service_description: req.body.service_description,
            trainerId: req.body.trainerId,
            image: req.file.path,
        })
        const output = await result.save();
        res.status(200).json({
            success: true,
            message: 'service data created!',
            data: output
        })
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'error'
        })
    }
}

const viewServices = (req, res) => {
    Service.aggregate([
        {
            $project: {
                __v: 0,
            }
        },
        // {
        //     $sort: {
        //         _id: -1
        //     }
        // },

        {
            $lookup: {
                from: "trainers",
                localField: "trainerId",
                foreignField: "_id",
                as: "trainer_details"
            },
        }

    ]).then((result) => {
        res.send({
            status: true,
            data: result,
            msg: "All data fetched"
        })
    }).catch((err) => {
        res.send({
            status: false,
            msg: "Could not fetch data",
            err: err
        })
    })
}

const serviceDetails = async (req, res) => {
    try {
        const id = req.params.id
        const getServiceDetails = await Service.findById(id)
        if (!getServiceDetails) {
            return res.status(404).json({
                success: false,
                message: "Not found service with id"
            })
        } else {
            return res.status(200).json({
                success: true,
                message: "Service Found Successfully",
                data: getServiceDetails
            })
        }
    } catch (err) {
        return res.status(404).json({
            success: false,
            message: "no data found"
        })
    }
}

const addReview = async (req, res) => {
    try {
        const result = new Testimonial({
            client_name: req.body.client_name,
            serviceId: req.body.serviceId,
            review: req.body.review,
            image: req.file.path,
        })
        const output = await result.save();
        res.status(200).json({
            success: true,
            message: 'tainer data created!',
            data: output
        })
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'error'
        })
    }
}

const viewReview = (req, res) => {
    Testimonial.aggregate([
        {
            $project: {
                __v: 0,
            }
        },
        // {
        //     $sort: {
        //         _id: -1
        //     }
        // },

        {
            $lookup: {
                from: "services",
                localField: "serviceId",
                foreignField: "_id",
                as: "service_details"
            },
        }

    ]).then((result) => {
        res.send({
            status: true,
            data: result,
            msg: "All data fetched"
        })
    }).catch((err) => {
        res.send({
            status: false,
            msg: "Could not fetch data",
            err: err
        })
    })
}

const createbooking = async (req, res) => {
    try {
        const result = new Booking({
            name: req.body.name,
            email: req.body.email,
            memberId: req.body.memberId,
            serviceId: req.body.serviceId,
            scheme: req.body.scheme,
            price: req.body.price,
        });
        const alreadyBooked = await Booking.findOne({ memberId: req.body.memberId, serviceId: req.body.serviceId });
        if (alreadyBooked) {
            return res.status(400).json({
                status: 400,
                message: "Already Booked!",
            })
        } else {
            const bookings = await result.save();
            const memberById = await Member.findOne({ _id: req.body.memberId });
            memberById.bookings.push(bookings._id);
            const userBookings = await memberById.save();
            return res.status(200).json({
                status: 200,
                message: "Training is Booked!",
                bookings
            })
        }
    } catch (error) {
        return res.status(400).json({
            status: 400,
            message: "error!",

        })
    }
}

const viewBookingData = async (req, res) => {
    try {
        const result = await Booking.find({ memberId: req.params.id }).populate("serviceId");
        return res.status(200).json({
            status: 200,
            message: "booking data fetched",
            result
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: 400,
            message: "error!"
        })
    }
}

const addBlog = async (req, res) => {
    try {
        const result = new Blog({
            title: req.body.title,
            subtitle: req.body.subtitle,
            content: req.body.content,
            image: req.file.path,
        })
        const output = await result.save();
        res.status(200).json({
            success: true,
            message: 'blog data created!',
            data: output
        })
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'error'
        })
    }
}

const viewBlogs=async(req,res)=>{
    try {
        const blogData = await Blog.find()
        return res.status(200).json({
            success: true,
            message: "Data Found",
            data: blogData
        })
    } catch (err) {
        return res.status(404).json({
            success: false,
            message: "no data found"
        })
    }
}

const blogDetails = async (req, res) => {
    try {
        const id = req.params.id
        const getBlogDetails = await Blog.findById(id)
        if (!getBlogDetails) {
            return res.status(404).json({
                success: false,
                message: "Not found blog with id"
            })
        } else {
            return res.status(200).json({
                success: true,
                message: "Blog Found Successfully",
                data: getBlogDetails
            })
        }
    } catch (err) {
        return res.status(404).json({
            success: false,
            message: "no data found"
        })
    }
}

module.exports = {
    createRegister,
    confirmaton,
    loginPost,
    logoutMember,
    addBannerData,
    viewBanner,
    addTrainer,
    viewTrainer,
    addService,
    viewServices,
    serviceDetails,
    addReview,
    viewReview,
    createbooking,
    viewBookingData,
    addBlog,
    viewBlogs,
    blogDetails
}