const express = require('express')
//require('dotenv').config()
//const mongoose = require('mongoose')
const { serverConfig, connectDB } = require('./Config')
const v1Router = require('./Routes')
const { globalErrorHandler } = require('./Controllers')

// setup express app
const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// API route
app.use('/api/v1/products', v1Router.productsRouter)
app.use('/api/v1/users', v1Router.authRouter)


// Connect DB
/*app.listen(serverConfig.PORT, async ()=> {
    await connectDB().then(()=> console.log("Connected"))
})*/
connectDB()
    .then(() => {
        app.listen(serverConfig.PORT, () => console.log(`App is listening at port ${serverConfig.PORT}`))
    })


// connect DB with mongoose
/*mongoose.connect('mongodb+srv://htaohid31:P70iXqZKayDIKHoJ@cluster0.d8bxfvc.mongodb.net/ecommerce-site?retryWrites=true&w=majority&appName=Cluster0')
    .then(conn => {
        console.log("Database connected successfully")
        app.listen(process.env.PORT, ()=> {
            console.log(`App is listening at port ${process.env.PORT}`)
        })
    })
    .catch(error => {
        console.log(error)
    })
*/ 
app.use(globalErrorHandler)
app.use('*', (req, res) => {
    res.status(404).json({
        'status': "fail",
        "message": "Not a valid api end point"
    })
})


