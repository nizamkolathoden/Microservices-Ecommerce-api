const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name:String,
    desc:String,
    price:Number,
    createAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model("product",productSchema)