const asyncHandler = require('express-async-handler')
const Goal = require('../models/goalModel')

//get goals /api/goals
//GET request
const getGoals = asyncHandler(async (req, res) =>{
    const goal = await Goal.find()
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

    const goal = await Goal.create({
        text: text
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

    await  goal.deleteOne()

    res.status(200).json({id: req.params.id})
})



module.exports = {
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal,
}