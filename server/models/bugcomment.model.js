const mongoose = require("mongoose")

const Schema = mongoose.Schema
const bugCommentSchema = new Schema({
    bugid: {
        type: String
    },
    usercomment: {
        type: String
    },
    userid: {
        type: String
    },
    username: {
        type: String
    }
}, { timestamps: true })

const BugComment = mongoose.model("BugComment", bugCommentSchema)
module.exports = BugComment