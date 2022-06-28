const express = require("express")
const app = express()
const PORT = process.env.PORT2||8080;
const amqp = require("amqplib")
const mongoose = require("mongoose")
const product = require("./product.schema")
const {verifyToken} = require("../AuthToken")
app.use(express.json())

mongoose.connect("mongodb://localhost/product").then(()=>{
    console.log("Connected to Product DB");
})

let channel;

const connect = async ()=>{
    try {
        const connect = await amqp.connect('amqp://localhost:5672')
        channel = await connect.createChannel()
        await channel.assertQueue("product")
        
    } catch (err) {
        console.log(err);
    }
}
connect()



//create a product

app.post("/create-product",verifyToken,async(req,res)=>{
    try {
        const {name,desc,price} = req.body
        const newProduct = await new product({
            name,
            desc,
            price
        }).save()
        res.json(newProduct)
    } catch (err) {
        res.status(500).json({error:"Internal Server Error"})
        console.log(err);
    }
})

app.get("/",async(req,res)=>{
    const allProducts = await product.find()
    res.json(allProducts)
})

app.post("/product-buy",verifyToken,async(req,res)=>{
    try {
        const {ids} = req.body;
        const {id} = req.payload
        const products =  await product.find({_id:{$in:ids}})
        await channel.sendToQueue('order',Buffer.from(JSON.stringify({products,userId:id})))
        channel.consume('product',msg=>{
            console.log(JSON.parse(msg.content));
        })
        // res.json(products)
    } catch (err) {
        console.log(err);
        res.status(500).json({error:"Internal Server Error"})

    }

})

app.listen(PORT,()=>{
    console.log(`Product Service Running on ${PORT}`);
})

