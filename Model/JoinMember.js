const mongoose=require('mongoose')
const Schema=mongoose.Schema

const joinMemberSchema= new Schema({
    client_name:{
        type:String,
        required:true
    },
    serviceId:{
        type:Schema.Types.ObjectId,
        ref:"service"
    },
    review:{
        type:String,
        required:true
    },
    image: {
        type: String,
        default:'',
        required:true
    },
    status:{
        type:String,
        default:1
    },
})


const joinMemberModel=mongoose.model("joinmember",joinMemberSchema)
module.exports=joinMemberModel