const express = require('express')
const Route=express.Router()
const ApiController=require('../Controller/ApiController')
const uploadImage=require('../Utility/uploadImage')
const memberVerify=require('../Middleware/memberVerify')

Route.post('/addbanner',uploadImage.single("image"),ApiController.addBannerData)
Route.get('/getbanner',ApiController.viewBanner)

Route.post('/taineradd',uploadImage.single("image"),ApiController.addTrainer)
Route.get('/gettrainer',ApiController.viewTrainer)

Route.post('/addservice',uploadImage.single("image"),ApiController.addService)
Route.get('/getservice',ApiController.viewServices)
Route.get('/getservicedetails/:id',ApiController.serviceDetails)

Route.post('/addtestimonial',uploadImage.single("image"),ApiController.addReview)
Route.get('/gettestimonial',ApiController.viewReview)

Route.post('/booking',memberVerify.verifyMemberToken,ApiController.createbooking)
Route.get('/viewBooking/:id',ApiController.viewBookingData)

Route.post('/addblog',uploadImage.single("image"),ApiController.addBlog)
Route.get('/getblog',ApiController.viewBlogs)
Route.get('/getblogdetails/:id',ApiController.blogDetails)

// *****authentication*****
Route.post('/register',uploadImage.single("image"),ApiController.createRegister)
Route.get('/confirmation/:email/:token',ApiController.confirmaton)
Route.post('/login', ApiController.loginPost)
Route.get('/logoutmember', ApiController.logoutMember)

module.exports=Route