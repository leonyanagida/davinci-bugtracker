const mongoose = require("mongoose")

const Schema = mongoose.Schema
const projectSchema = new Schema({
    bugs: {
        type: Array
    },
    description: {
        type: String
    },
    projectmanager: {
        type: String
    },
    projectname: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true })

const Project = mongoose.model("Project", projectSchema)
module.exports = Project