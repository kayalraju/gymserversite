const express = require('express')
const Route=express.Router()
const AdminController=require('../Controller/AdminController')
const AdminBannerController=require('../Controller/AdminBannerController')
const AdminServiceController=require('../Controller/AdminServiceController')
const AdminTestimonialController=require('../Controller/AdminTestimonialController')
const AdminBlogController=require('../Controller/AdminBlogController')
const uploadImage=require('../Utility/uploadImage')
const adminVerify=require('../Middleware/adminVerify')


// ***authentication***
Route.get('/loginform', AdminController.loginForm)
Route.post('/login', AdminController.loginPost)
Route.get('/registerform', AdminController.registerForm)
Route.post('/register',uploadImage.single("image"),[adminVerify.checkEmali],AdminController.createRegister)
Route.get('/confirmation/:email/:token',AdminController.confirmaton)
Route.get('/logout',[adminVerify.jwtAuth],AdminController.adminAuth,AdminController.logoutAdmin)

//*****admin pages*****
Route.get('/', [adminVerify.jwtAuth],AdminController.adminAuth,AdminController.index)

// *****booking approval*****
Route.get('/bookings',[adminVerify.jwtAuth],AdminController.adminAuth, AdminController.bookingDetailsData)
Route.get("/approve/:id",AdminController.approve);
Route.get("/disapprove/:id",AdminController.disapprove);

// ****trainer routes****
Route.get('/trainer',[adminVerify.jwtAuth],AdminController.adminAuth, AdminController.getTrainer)
Route.get('/getaddTrainer', AdminController.addTrainer)
Route.post('/traineradd',uploadImage.single("image"), AdminController.postTrainer)
Route.get('/geteditTrainer/:id', AdminController.getEditTrainer)
Route.post('/trainerupdate',uploadImage.single("image"), AdminController.updateTrainer)
Route.get('/deleteTrainer/:id', AdminController.trainerDelete)
Route.get('/activeTrainer/:id', AdminController.trainerActivate)
Route.get('/deactiveTrainer/:id', AdminController.trainerDeactivate)

// ****banner routes****
Route.get('/banner',[adminVerify.jwtAuth],AdminController.adminAuth, AdminBannerController.getBanner)
Route.get('/getaddBanner', AdminBannerController.addBanner)
Route.post('/banneradd',uploadImage.single("image"), AdminBannerController.postBanner)
Route.get('/geteditBanner/:id', AdminBannerController.getEditBanner)
Route.post('/bannerupdate',uploadImage.single("image"), AdminBannerController.updateBanner)
Route.get('/deleteBanner/:id', AdminBannerController.bannerDelete)
Route.get('/activeBanner/:id', AdminBannerController.bannerActivate)
Route.get('/deactiveBanner/:id', AdminBannerController.bannerDeactivate)


// *****service routes*****
Route.get('/service',[adminVerify.jwtAuth],AdminController.adminAuth, AdminServiceController.getServices)
Route.get('/getaddService', AdminServiceController.addService)
Route.post('/serviceadd',uploadImage.single("image"), AdminServiceController.postService)
Route.get('/geteditService/:id', AdminServiceController.getEditService)
Route.post('/serviceupdate',uploadImage.single("image"), AdminServiceController.updateService)
Route.get('/deleteService/:id', AdminServiceController.serviceDelete)
Route.get('/activeService/:id', AdminServiceController.serviceActivate)
Route.get('/deactiveService/:id', AdminServiceController.serviceDeactivate)

// *****testimonial routes****
Route.get('/testimonial',[adminVerify.jwtAuth],AdminController.adminAuth, AdminTestimonialController.getTestimonial)
Route.get('/getaddTestimonial', AdminTestimonialController.addTestimonial)
Route.post('/testimonialadd',uploadImage.single("image"), AdminTestimonialController.postTestimonial)
Route.get('/geteditTestimonial/:id', AdminTestimonialController.getEditTestimonial)
Route.post('/testimonialupdate',uploadImage.single("image"), AdminTestimonialController.updateTestimonial)
Route.get('/deleteTestimonial/:id', AdminTestimonialController.testimonialDelete)
Route.get('/activeTestimonial/:id', AdminTestimonialController.testimonialActivate)
Route.get('/deactiveTestimonial/:id', AdminTestimonialController.testimonialDeactivate)

// ***blog routes***
Route.get('/blog',[adminVerify.jwtAuth],AdminController.adminAuth, AdminBlogController.getBlog)
Route.get('/getaddBlog', AdminBlogController.addBlog)
Route.post('/blogadd',uploadImage.single("image"), AdminBlogController.postBlog)
Route.get('/geteditBlog/:id', AdminBlogController.getEditBlog)
Route.post('/blogupdate',uploadImage.single("image"), AdminBlogController.updateBlog)
Route.get('/deleteBlog/:id', AdminBlogController.blogDelete)
Route.get('/activeBlog/:id', AdminBlogController.blogActivate)
Route.get('/deactiveBlog/:id', AdminBlogController.blogDeactivate)



module.exports=Route