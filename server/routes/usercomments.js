const mongoose = require("mongoose")
const router = require("express").Router()
const BugComment = require("../models/bugcomment.model")
const User = require("../models/user.model")

// @GET
// Route: app/usercomments/:userid
router.route("/:userid").get((req, res) => {
    User.findById(req.params.userid)
        .then(user => {
            let userCommentArr = user.usercomments

            BugComment.find({ _id: userCommentArr })
                .then(comments => {
                    res.status(200).send(comments)
                })
        })
        .catch(() => {
            res.status(400).send("Wow error finding user comments")
        })
})

module.exports = router