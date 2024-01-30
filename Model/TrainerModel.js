const mongoose=require('mongoose')
const Schema=mongoose.Schema

const trainerSchema= new Schema({
    name:{
        type:String,
        required:true
    },
    speciality:{
        type:String,
        required:true
    },
    experience:{
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


const trainerModel=mongoose.model("trainer",trainerSchema)
module.exports=trainerModel