const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")


const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, age: {
        type: Number,
        default: 0,
        // using custom validation
        validate(value) {
            if(value<0) {
                throw new Error("Age must be a positive number")
            }
        }
    }, email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Email is not valid")
            }
        }
    }, password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(pass) {
            if((/password/i).test(pass) === true) {
                throw new Error("password cannot contain 'password'")
            }
        }
    },tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
},{
    timestamps: true
})

// set relationship between user and task
schema.virtual('tasks', {
    ref: 'task',
    localField: '_id',
    foreignField: 'owner'
})
// definining as statics makes it accessible from other modules
schema.methods.generateAuthToken = async function() {
    //console.log(this.email)
    const token = jwt.sign({_id: this._id.toString()}, "this is my secret")
    //console.log(this._id, token)
    this.tokens = this.tokens.concat({token})
    return token
}
schema.statics.findByCredentials = async (email, pass) => {
    //console.log(email, pass)
    const user = await User.findOne({email})
    if(!user) throw new Error("Unable to login")
    const isMatch = await bcrypt.compare(pass, user.password)
    if(!isMatch) throw new Error("Unable to login")
    return user
}
// using regular function because arrow function doesn't bind to the caller
schema.pre('save', async function(next){
    //console.log("Running in the MIddleWare");
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next()
})
const User = mongoose.model('User', schema)

module.exports = User