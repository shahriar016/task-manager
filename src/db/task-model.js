const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    }, completed: {
        type: Boolean,
        default: false
    }, owner: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
},{
    timestamps: true
})
const Task = mongoose.model('task', schema)

module.exports = Task