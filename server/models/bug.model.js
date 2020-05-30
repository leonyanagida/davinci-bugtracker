const mongoose = require("mongoose")

const Schema = mongoose.Schema
const bugSchema = new Schema({
    assignedto: {
        type: Array
    },
    bughistory: {
        type: Array
    },
    bugtype: {
        type: String,
        required: true
    },
    bugstatus: {
        type: String,
        required: true
    },
    comments: {
        type: Array
    },
    description: {
        type: String
    },
    duedate: {
        type: Date
    },
    lastupdated: {
        type: Date
    },
    language: {
        type: String
    },
    submitter: {
        type: String
    },
    title: {
        type: String,
        required: true
    },
    totaltime: {
        type: Date
    },
    priority: {
        type: String
    },
    projectname: {
        type: String
    }
}, { timestamps: true })

const Bug = mongoose.model("Bug", bugSchema)
module.exports = Bug