require('dotenv').config()

module.exports= {
    'PORT': process.env.PORT,
    'NODE_ENV': process.env.NODE_ENV,
    'SECRET_STR': process.env.SECRET_STR,
    'LOGIN_EXPIRES': process.env.LOGIN_EXPIRES
}