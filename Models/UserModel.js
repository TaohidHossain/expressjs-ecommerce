const mongoose = require('mongoose')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const validator = require('validator')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter tour name"]
        },
        email: {
            type: String,
            requiredL: [true, "Please enter an email"],
            unique: true,
            validate: [validator.isEmail, "Please enter a valid email"]
        },
        photo: String,
        role: {
            type: String,
            enum:['user', 'admin', 'staff'],
            default: 'user'
        },
        password: {
            type: String,
            required: [true, "Please enter a password"],
            minlength: 6,
            select: false
        },
        confirmPassword: {
            type: String,
            required: [true, "Please confirm your password"],
            validate: {
                // this validator only works on save() and create()
                validator: function(val){ // arrow function won't work here
                    return val == this.password
                },
                message: "Password and Confirm Password do not match"
            }
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetTokenExpires: Date
    },
    {
        timestamps: true
    }
)

// arrow function won't work here
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next()
    // encrypt the password before saving
    this.password = await bcrypt.hash(this.password, 4)
    this.confirmPassword = undefined
    next()
})

userSchema.methods.comparePasswordInDB = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.isPasswordChanged = function(JWTTimestamp){
    if(this.passwordChangedAt){
        const passwordChangedAt = parseInt(this.passwordChangedAt.getTime() / 1000)
        return JWTTimestamp < passwordChangedAt
    }
    return false
}

userSchema.methods.createResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(16).toString('hex')
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    this.passwordResetTokenExpires = Date.now() + 5 * 60 * 1000 // 5 minutes
    return resetToken
}

const User = mongoose.model('User', userSchema)
module.exports = User