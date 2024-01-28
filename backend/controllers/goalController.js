const asyncHandler = require('express-async-handler')
const Goal = require('../models/goalModel')
const User = require('../models/userModel')

//get goals /api/goals
//GET request
const getGoals = asyncHandler(async (req, res) =>{
    const goal = await Goal.find({user: req.user.id})
    res.status(200).json(goal)
})


//create a goal /api/goals
//POST request
const createGoal = asyncHandler(async (req, res) =>{
    const text = req.body.text
    if(!text){
        res.status(400)
        throw new Error('Text field required')
    }

    //create goal
    const goal = await Goal.create({
        text: text,
        user: req.user.id
    })
    res.status(200).json(goal)
})

//update goal /api/goals/:id
//PUT request
const updateGoal = asyncHandler(async (req, res) =>{
    const goal = await Goal.findById(req.params.id)
    if(!goal){
        res.status(400)
        throw new Error('Goal not found')
    }

    //get logged in user
    const user = await User.findById(req.user.id)
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }

    //check if the logged in user matches the goal user
    if(goal.user.toString() !== user.id){
        res.status(401)
        throw new Error('User not authorized')
    }

    //update goal
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body)
    res.status(200).json(updatedGoal)
})

//delete goal /api/goals/:id
//DELETE request
const deleteGoal = asyncHandler(async (req, res) =>{
    const goal = await Goal.findById(req.params.id)
    if(!goal){
        res.status(400)
        throw new Error('Goal not found')
    }

        //get logged in user
        const user = await User.findById(req.user.id)
        if(!user){
            res.status(401)
            throw new Error('User not found')
        }
    
        //check if the logged in user matches the goal user
        if(goal.user.toString() !== user.id){
            res.status(401)
            throw new Error('User not authorized')
        }

    await  goal.deleteOne()

    res.status(200).json({id: req.params.id})
})



module.exports = {
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal,
}