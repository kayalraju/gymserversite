const mongoose = require('mongoose');
const schema = mongoose.Schema

const newSchema = new schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default:'',
        required:true
    },
    isAdmin: {
        type: String,
        enum: ['member', 'admin'],
        default: "member"
    },
    status: {
        type: Boolean,
        default: true
    },
    bookings:[{
        type:mongoose.Types.ObjectId,
        ref:'booking'
    }],
    isVerified: {
        type: Boolean,
        default: false,
    }
})

const memberSchema = mongoose.model("member", newSchema)

module.exports = memberSchema;