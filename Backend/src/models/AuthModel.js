import mongoose from 'mongoose'

const SignUpModel =  new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    profile:{
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    address:{
        type: String
    },
    dob: {
        type: Date
    },
    password: {
        type: String,
        required: true,
        min: 9
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
   
}, {timestamps: true})

const Signup = mongoose.model('Signup', SignUpModel)
export default Signup