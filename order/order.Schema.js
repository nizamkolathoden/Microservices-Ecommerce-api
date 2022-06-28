const mongoose = require("mongoose")

const Order = new mongoose.Schema({
    products:[
        {
            product_id:String,
            name:String,
            price:Number,
            desc:String
        }
    ],
    user:String,
    total_price:Number,
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model("order",Order)