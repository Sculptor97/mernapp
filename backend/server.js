const express = require('express')
const dotenv = require('dotenv').config()
const {errorHandler} = require('./middleware/errorMiddleware')
const colors = require('colors')
const port = process.env.PORT || 3000
const connectDB = require('./config/db')



const app = express()
connectDB()

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use('/api/goals', require('./routes/goalRoutes'))
app.use(errorHandler)
  




app.listen(port, () => {
    console.log(`Server Started on port ${port}...`)
})