const express = require("express")
const app = express()
const amqp = require("amqplib")
const mongoose = require("mongoose")
const order = require("./order.Schema")
app.use(express.json())

let channel;

const connect = async()=>{
    const connect = await amqp.connect("amqp://localhost:5672")
    console.log('connected mq')
    channel = await connect.createChannel()
    await channel.assertQueue("order")
    
}

function createOrder (products,userId){
    let total_price = 0
    products.map(data=>{
        total_price+=data.price;
    })
    // total_price = parseInt(total_price)
    console.log("fuck",typeof(total_price));
    const newOrder =  new order({
        user:userId,
        total_price,
        products
    })
    newOrder.save()
    return  newOrder;
}


    connect().then(()=>{
        channel.consume('order',msg=>{
            const {products,userId} = JSON.parse(msg.content)
            newOrder = createOrder(products,userId)
            console.log(newOrder);
            channel.ack(msg)
            channel.sendToQueue(
                'product',
                Buffer.from(JSON.stringify(newOrder))
            )

        })
    })
        
        

mongoose.connect("mongodb://localhost/order").then(()=>{
    console.log("Connected To Order DB");
})



app.get("/",(req,res)=>{
    try {
        channel.consume('order',msg=>{
            console.log("hi",JSON.parse(msg.content));
            channel.ack(msg)
        })
    } catch (err) {
        console.log(err.msg);
    }
    
})


const PORT=process.env.PORT2||9090

app.listen(PORT,()=>{
    console.log(`Order Service Running On Port:${PORT}`);
})