class CustomError extends Error{
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode
        this.operational = true
    }
}
module.exports = CustomError