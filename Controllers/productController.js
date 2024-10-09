const { Product } = require('../Models')
const { asyncErrorHandler, CustomError } = require('../Utils')

const getAllProducts = asyncErrorHandler(async (req, res, next) => {
    let queryObj = { ...req.query }
    // Pagination, Limiting logics
    let page = req.query.page ? req.query.page : 1 // by default show 1st page 
    let limit = req.query.limit ?  req.query.limit : 10 // by default limit to 10 documents
    let skip = (page - 1) * limit
    const productCount = await Product.countDocuments()
    if( skip > productCount){
        const error = new CustomError("This page is not found", 404)
    }
    // Sorting and Selecting Fields logics
    let sortBy = req.query.sort ? req.query.sort.split(',').join(' ') : '-createdAt' // by default sort by latest product
    let fields = req.query.fields ? req.query.fields.split(',').join(' ') : '-__v'

    delete queryObj['page']
    delete queryObj['limit']
    delete queryObj['sort']
    delete queryObj['fields']
    
    let query = Product.find(queryObj)
    query = query.sort(sortBy).skip(skip).limit(limit).select(fields)

    const products = await query
    return res.status(200).json({
        'status': 'success',
        'length': products.length,
        'data': products
    })
})

const getProduct = asyncErrorHandler(async (req, res, next) => {
    let fields = req.query.fields ? req.query.fields : '-__v'
    const product = await Product.findById(req.params.id).select(fields)
    if(product){
        return res.status(200).json({
            'status': 'success',
            'data': product
        })
    }
    else{
        const message = 'Product with id ' + req.params.id + ' does not exist'
        const error = new CustomError(message, 404)
        return next(error)
    }
})

const createProduct = asyncErrorHandler(async (req, res, next) => {
    const product = await Product.create(req.body)
    productResponse = await Product.findById(product._id).select('-__v')
    return res.status(201).json({
        'status': 'success',
        'data': productResponse
    })
})

const updateProduct = asyncErrorHandler(async (req, res, next) => {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
    if(!updatedProduct){
        const msg = "Product with id " + req.params.id + " does not exits"
        const err = new CustomError(msg, 404)
        return next(err)
    }
    return res.status(200).json({
        "status" : "success",
        "data" : updatedProduct
    })
})

const deleteProduct = asyncErrorHandler(async (req, res, next) => {
    const deletedProduct = await Movie.findByIdAndDelete(req.params.id)
        if(!deletedProduct){
            const msg = "Product with id " + req.params.id + " does not exits"
            const err = new CustomError(msg, 404)
            return next(err)
        }
        return res.status(200).json({
            "status" : "success",
            "data" : deletedProduct
        })
})


module.exports = { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct }