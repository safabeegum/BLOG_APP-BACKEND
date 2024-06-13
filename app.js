const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
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


//signIn API
app.post("/signin", (req,res) => {
    let input = req.body
    blogmodel.find({"email":req.body.email}).then(              //check username exists or not
        (response) => {
            if (response.length>0) {                            //if length of username is greater than 0 acc exists
                let dbPassword = response[0].password
                console.log(dbPassword)
                bcrypt.compare(input.password,dbPassword,(error,isMatch) => {       //check password matches(compare is a function in bcrypt)
                    if (isMatch) {
                        jwt.sign({email:input.email}, "blog-app", {expiresIn:"1d"}, (error,token) => {
                            if (error) {
                                res.json({"status":"unable to create token"})
                            } else {
                                res.json({"status":"success","userId":response[0]._id,"token":token})
                            }
                        })
                             //if password is equal then the userid of the user is also saved to understand which user is logged in
                    } else {
                        res.json({"status":"incorrect password"})
                        
                    }
                })
            } else {
                res.json({"Status":"User no found"})
                    
            }
        }
    ).catch()

})



app.listen(8080,() => {
    console.log("Server Started")
})

