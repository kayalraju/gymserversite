const mongoose=require('mongoose')
const Schema=mongoose.Schema

const serviceSchema= new Schema({
    service_name:{
        type:String,
        required:true
    },
    service_description:{
        type:String,
        required:true
    },
    trainerId:{
        type:Schema.Types.ObjectId,
        ref:"trainer"
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


const serviceModel=mongoose.model("service",serviceSchema)
module.exports=serviceModel