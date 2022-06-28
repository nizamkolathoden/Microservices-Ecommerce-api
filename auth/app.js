const express = require("express")
const app = express()
const PORT = process.env.PORT1||7070;
const mongoose = require("mongoose")
const User = require("./model/user.Schema")
const jwt = require("jsonwebtoken")
app.use(express.json())

mongoose.connect("mongodb://localhost/auth").then(()=>{
    console.log("Connected to Auth DB");
})
app.get("/",(req,res)=>{
    console.log("hi");
    res.json("hello")
})
//register
app.post("/register",async(req,res)=>{
    try {
        const {email,password,name} = req.body
        if(!email||!password||!name)
            return res.status(404).json({error:"Please Enter password and email"})

    isuserExist = await User.findOne({email})
    if(isuserExist)
        return res.json({error:"User Already Exists In This Email"})

    const newUser =await new User({
        email,
        password,
        name
    }).save()
    const payload = {
        id:newUser._id
    }
    const token = await jwt.sign(payload,"Key")
    res.json({token})
      
    } catch (err) {
        console.log(err);
        res.status(500).json({error:"Internal Server Error"})
    }
    
})
//login
app.post("/login",async(req,res)=>{
    try {
        const {email,password} = req.body
        if(!email||!password)
            return res.status(404).json({error:"Please Enter password and email"})

    isuserExist = await User.findOne({email})
    if(!isuserExist||isuserExist.password!==password)
        return res.json({error:"Wrong Password/Email"})
        const payload = {
            id:isuserExist._id
        }

        const token = await jwt.sign(payload,"Key")
        res.json({token})
    } catch (err) {
        console.log(err);
        res.status(500).json({error:"Internal Server Error"})
    }
    
})


app.listen(PORT,()=>{
    console.log(`Auth Service Running on ${PORT}`);
})

