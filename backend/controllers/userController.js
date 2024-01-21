
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asynHandler = require('express-async-handler')
const User = require('../models/userModel')

//description Register user
//route POST api/users/
//access public
const registerUser = asynHandler(async (req, res) => {

    const {name, email, password} = req.body
    //check for all field data
    if(!name|| !email|| !password){
        res.status(400)
        throw new Error('Please add all required fields')
    }

    //check if user already exist
    const userExist = await User.findOne({email})
    if(userExist){
        res.status(400)
        throw new Error('User already Exist')
    }

    //hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)
    //creat user
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if(user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else{
        res.status(400)
        throw new Error('Invalid user data')
    }
})


//description Authenticate user
//route POST api/users/
//access private
const loginUser = asynHandler(async (req, res) => {

    const {email, password} = req.body
    //check for user email
    const user = await User.findOne({email})
    if(user && (bcrypt.compare(password,user.password))){

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else{
        res.status(400)
        throw new Error('Invalid Credentials')
    }
})


//description get user information
//route GET api/users/
//access private
const getMe = asynHandler(async (req, res) => {
    res.status(200).json({message: 'Get User'})
})

//generate token
const generateToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:'30d',
    })
}

module.exports = {
    registerUser,
    loginUser,
    getMe,
}