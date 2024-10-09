const mongoose = require('mongoose')

require('dotenv').config()
const host = process.env.DB_HOST
const username = process.env.DB_USERNAME
const password = process.env.DB_PASSWORD
const cluster = process.env.DB_CLUSTER
const collection = process.env.DB_COLLECTION_NAME

// mongoose.connect('mongodb+srv://htaohid31:P70iXqZKayDIKHoJ@cluster0.d8bxfvc.mongodb.net/ecommerce-site?retryWrites=true&w=majority&appName=Cluster0')
const DB_URL = host + '://' + username  + ':' + password + '@' + cluster + '/' + collection + '?retryWrites=true&w=majority&appName=Cluster0'

async function connectDB(){
    try{
        await mongoose.connect(DB_URL)
    }
    catch(error){
        console.log(error)
    }
}

module.exports = connectDB