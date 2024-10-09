const mongoose = require('mongoose')

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product's name is required"]
        },
        price: {
            type: Number,
            required: [true, "Product's price is required"]
        },
        discountedPrice: {
            type: Number,
            required: [true, "Product's discounted price is required"]
        },
        quantity: {
            type: Number,
            default: 0
        },
        status: {
            type: String,
            enum: ["Available", "Out of stock", "Coming soon"],
            default: "Coming soon"    
        },
        photo: String
    },
    {
        timestamps: true
    }
)

const Product = mongoose.model('Product', productSchema)
module.exports = Product