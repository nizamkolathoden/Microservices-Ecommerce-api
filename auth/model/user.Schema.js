const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    email:{
        type:String,
        lowercase:true,

    },
    password:String,
    name:String,
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model("user",userSchema)