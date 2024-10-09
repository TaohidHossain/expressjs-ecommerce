module.exports =  (error, req, res,  next) => {
    error.status = error.status || 'error'
    error.stattusCode = error.stattusCode || 500
    res.status(error.stattusCode).json({
        'status': error.status,
        'statusCode': error.stattusCode,
        'message': error.message,
        'error': error
    })
}
