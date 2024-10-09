const { User } = require('../Models')
const { asyncErrorHandler, CustomError } = require('../Utils')
const jwt = require('jsonwebtoken')
const serverConfig = require('../Config/serverConfig')

const signToken = function(id){
    console.log(parseInt( serverConfig.LOGIN_EXPIRES / 1000 ))
    const token = jwt.sign({id}, serverConfig.SECRET_STR, { expiresIn: parseInt( serverConfig.LOGIN_EXPIRES / 1000 ) })
    return token
}
const signup = asyncErrorHandler(async (req, res, next) => {
    // Create a New User
    // This API won't login a user
    const newUser = await User.create(req.body)
    return res.status(201).json({
        'status': 'success'
    })
})

const login = asyncErrorHandler(async (req, res, next) => {
    // 1.0 find user with given email
    const { email, password } = req.body
    if(!email || !password){
        const error = new CustomError("Please provide both Email and Password for login in", 400)
        next(error)
    }
    const user = await User.findOne({email}).select('+password')
    if(!user || !await user.comparePasswordInDB(password)){
        const error = new CustomError("Incorrect email or password", 400)
        return next(error)
    }
    //2.0 sign jwt token and send the token
    const token = signToken(user._id)
    const userObj = { ...user._doc }
    delete userObj['password']
    delete userObj['__v']
    return res.status(200).json({
        'status': 'seccess',
        token,
        'user': userObj
    })
})

const protect = asyncErrorHandler(async (req, res, next) => {
    // 1.0 Read the token and check if it exists
    const authToken = req.headers.authorization
    let token
    if(authToken && authToken.startsWith('Bearer'))
        token = authToken.split(' ')[1]
    if(!token){
        const error = new CustomError('You are not logged in', 401)
        next(error)
    }
    //2.0 validate the token
    const decodedToken = jwt.verify(token, serverConfig.SECRET_STR)
    //3.0 check if the user exists
    const user = await User.findById(decodedToken.id)
    if(!user){
        const error = new CustomError("The user with given token does not exist.", 404)
        next(error)
    }
    //3.1 check if the user changed password after the token was issued
    if(await user.isPasswordChanged(decodedToken.iat)){
        const error = new CustomError("Password has been changed recently. Please log in again.", 401)
        next(error)
    }
    //4.0 Allow user to proceed
    req.user = user
    next()
})

const allowAcces = (roles) => {
    return asyncErrorHandler(async (req, res, next) => {
        if(!roles.includes(req.user.role)){
            const error = new CustomError("This user does not have permission for this action", 403)
            next(error)
        }
        next()
    })
}

const forgotPassword = asyncErrorHandler(async (req, res, next) => {

})

const resetPassword= asyncErrorHandler(async (req, res, next) => {

})

module.exports = { signup, login, protect, allowAcces, forgotPassword, resetPassword }