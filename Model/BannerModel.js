const mongoose=require('mongoose')
const Schema=mongoose.Schema

const bannerSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    subtitle:{
        type:String,
        required:true
    },
    image: {
        type: String,
        default:''
    },
    status:{
        type:String,
        default:1
    },
})


const bannerModel=mongoose.model("banner",bannerSchema)
module.exports=bannerModel