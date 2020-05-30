const mongoose = require("mongoose")

const Schema = mongoose.Schema
const oldBugSchema = new Schema({
    assignedto: {
        type: Array
    },
    bughistory: {
        type: Array
    },
    bugtype: {
        type: String,
    },
    bugstatus: {
        type: String,
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

const OldBug = mongoose.model("OldBug", oldBugSchema)
module.exports = OldBug