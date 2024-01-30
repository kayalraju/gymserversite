const mongoose=require('mongoose')
const schema=mongoose.Schema;

const bookingSchema=new schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    memberId:{
        type:mongoose.Types.ObjectId,
        ref:'member'
    },
    serviceId:{
        type:mongoose.Types.ObjectId,
        ref:'service'
    },
    scheme:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    isPending:{
        type:Boolean,
        default:true
   }
})

const bookingModel=mongoose.model('booking',bookingSchema);
module.exports=bookingModel;



