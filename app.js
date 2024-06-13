const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")

const {blogmodel} = require("./models/blog")


const app = express()
app.use(cors())
app.use(express.json())

// -----same for all projects-------
// to generate hashed password
// make it asynchronous function(async)
const generateHashedPassword = async (password) => {
        const salt=await bcrypt.genSalt(10)             //set salt value(salt->cost factor value) 
        return bcrypt.hash(password,salt)               
}


//mongodb connection
mongoose.connect("mongodb+srv://safabeegum:mongodb24@cluster0.pbzbbey.mongodb.net/blogdb?retryWrites=true&w=majority&appName=Cluster0")


//make sign aync function because an asynchronous function cannot be called by a synchronous function
app.post("/signup",async(req,res) => {
    let input = req.body
    let hashedPassword = await generateHashedPassword(input.password)        
    console.log(hashedPassword)   
    input.password = hashedPassword             //to change in input otherwise in db it will be plain text    
    let user = new blogmodel(input)
    user.save() 
    res.send({"status":"success"})
    
})

app.listen(8080,() => {
    console.log("Server Started")
})

