const mongoose = require("mongoose")

const Schema = mongoose.Schema
const userSchema = new Schema({
    assignedbugs: {
        type: Array
    },
    assignedprojects: {
        type: Array
    },
    email: {
        type: String,
        index: true,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    submittedbugs: {
        type: Array
    },
    usercomments: {
        type: Array
    }

}, { timestamps: true })

const User = mongoose.model("User", userSchema)
module.exports = User