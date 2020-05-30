const mongoose = require("mongoose")
const assert = require('assert');
const diff = require("deep-object-diff").diff;
const router = require("express").Router()
const Bug = require("../models/bug.model")
const OldBug = require("../models/oldbug.model")
const BugComment = require("../models/bugcomment.model")
const Project = require("../models/project.model")
const User = require("../models/user.model")
const verifyToken = require("../auth/verifyToken")

// @POST
// Route /bugs/add
router.route("/add").post((req, res) => {
    const assignedto = req.body.assignedto
    const bugtype = req.body.bugtype
    const bugstatus = req.body.bugstatus
    const bughistory = []
    const comments = []
    const description = req.body.description
    const duedate = req.body.duedate
    const lastupdated = null
    const language = req.body.language
    const submitter = req.body.submitter
    const title = req.body.title
    const totaltime = null
    const priority = req.body.priority
    const projectname = req.body.projectname

    const newBug = new Bug({ 
        assignedto,
        bugtype,
        bugstatus,
        bughistory,
        comments,
        description,
        duedate,
        lastupdated,
        language,
        submitter,
        title,
        totaltime,
        priority,
        projectname
     })

    newBug.save()
        .then(buggy => {
            Project.findOne({ projectname: buggy.projectname })
            .then(project => {
                project.bugs.push(buggy._id)
                project.save()
                     .catch(err => res.status(400).send("Error updating bug! " + err))
            })
            .catch(err => res.status(400).send("error " + err))

            User.findOne({ name: buggy.submitter })
                .then(user => {
                    user.submittedbugs.push(buggy._id)
                    user.save()
                })
                .catch(err => res.status(400).send("err " + err))
            
            User.find({ name: {$in:  buggy.assignedto  }})
            .then((data => {
                data.map(a => {    
                    User.findById(a._id)
                        .then(user => {
                            user.assignedbugs.push(buggy._id)
                            user.save()
                        })
                })
            }))
            .then(() => {
                return res.status(200).send({id: buggy._id})
            })
            .catch(err => res.status(400).send("ERERR HERE " + err))
        })
        .catch(err => res.status(400).send("Error adding bug " + err))
})

// @POST
// Route /bugs/update/:bugid
router.route("/update/:bugid").post(async (req, res) => {
    // Store the old bug in an object
    let prevBug = {}

    await Bug.findById(req.params.bugid)
        .then(buggy => prevBug = buggy)
        .catch(err => res.status(400).json("error fupdating bug " + err))

    await Bug.findById(req.params.bugid)
        .then(bug => {
            Project.findOne({ projectname: bug.projectname })
            .then(project => {
                project.bugs.pop(bug._id)
                project.save()
                     .catch(err => res.status(400).send("Error updating bug! " + err))
            })
            .catch(err => res.status(400).send("error " + err))

            User.find({ name: {$in:  bug.assignedto  }})
            .then((data => {    
                data.map(a => {    
                    User.findById(a._id)
                        .then(user => {
                            user.assignedbugs.pop(bug._id)
                            user.save()
                        })
                })
            }))
            .catch(err => res.status(400).send("ERERR HERE " + err))

            // Assign updates to items
            bug.assignedto = req.body.assignedto
            bug.bugtype = req.body.bugtype
            bug.bugstatus = req.body.bugstatus
            bug.description = req.body.description
            bug.duedate = req.body.duedate
            bug.language = req.body.language
            bug.title = req.body.title
            bug.priority = req.body.priority
            bug.projectname = req.body.projectname

            // Push the bug into the new users
            User.find({ name: {$in:  bug.assignedto  }})
            .then((data => {    
                data.map(a => {    
                    User.findById(a._id)
                        .then(user => {
                            user.assignedbugs.push(bug._id)
                            user.save()
                        })
                })
            }))
            .catch(err => res.status(400).send("ERERR HERE " + err))

            // Save the bug
            bug.save()
                .then((buggy) => {
                    // Use the deep-object-diff package to find differences in the two objects
                    const difference = diff(prevBug, buggy)
                    return difference;
                })
                .then((buggy2) => {
                    // Get the items that have changed and put them in array using entries
                    let entries = Object.entries(buggy2)
                    // Make sure to do entries[1], as we are checking the array, not the object
                    if (entries[1] === undefined) {
                        // Send the user back to the update page if nothing was changed
                        return res.status(400).json("Nothing was changed!")
                    }

                    // Create a date timestamp that goes into entries array
                    let d = new Date(Date.now()).toLocaleString()
                    // Remove the "_doc" at the start of the entries array'
                    // What entries originally returns: ["_doc", { priority: "Low" }]
                    entries = entries[1].splice(1)
                    // Push the date into the array
                    // Date will always be the last item in the array
                    entries.push(d)
                    // Push the changes to the bughistory
                    bug.bughistory.push(entries)
                    // Make sure to save the latest changes
                    bug.save()
                        .then(() => res.json("Success updating Bug!"))
                })
                .catch(err => res.status(400).json("Error updating bug! " + err))
        })
        .catch(err => res.status(400).json("Error " + err))
})

// @POST
// Route /bugs/update/resolve/:bugid
router.route("/update/resolve/:bugid").post((req, res) => {
    Bug.findById(req.params.bugid)
        .then(bug => {
            // Changed the bug status to resolved
            bug.bugstatus = "Resolved"
            bug.save()
                .then(buggy => {
                    const assignedto = buggy.assignedto
                    const bugtype = buggy.bugtype
                    const bugstatus = buggy.bugstatus
                    const bughistory = buggy.bughistory
                    const comments = buggy.comments
                    const description = buggy.description
                    const duedate = buggy.duedate
                    const lastupdated = buggy.lastupdated
                    const language = buggy.language
                    const submitter = buggy.submitter
                    const title = buggy.title
                    const totaltime = null
                    const priority = buggy.priority
                    const projectname = buggy.projectname
        
                    const oldBug = new OldBug({ 
                        assignedto,
                        bugtype,
                        bugstatus,
                        bughistory,
                        comments,
                        description,
                        duedate,
                        lastupdated,
                        language,
                        submitter,
                        title,
                        totaltime,
                        priority,
                        projectname
                    })

                    oldBug.save()
                        .catch(err => res.status(400).send("Err " + err))
                })
                .then(() => {
                    // Delete the resolved bug from the bugs collection
                    Bug.findByIdAndDelete(req.params.bugid)
                    .then(() => res.status(200).send("Bug Deleted"))
                    .catch(err => res.status(400).json("Error " + err))
                })
        })
        .catch(err => res.status(400).send("error " + err))
})

// @POST
// Route /bugs/:bugid/comment/add
router.route("/:bugid/comment/add").post(async (req, res) => {
    await Bug.findById(req.params.bugid)
        .then(bug => {
            const usercomment = req.body.usercomment
            const userid = req.body.userid
            const username = req.body.username
            const bugid = req.body.bugid
        
            const newComment = new BugComment({ usercomment, userid, username, bugid })
            
            newComment.save()
                .then((comment) => {
                    // ONLY push the comment.id to keep the comments array light
                    // We will do the logic of getting the comments when we go
                    // directly into the bug page
                    bug.comments.push(comment._id)
                    //Save the bug
                    bug.save()
                        .then(() => {
                            // Add the comment to the usercomments array in the User Collection
                            User.findById(userid)
                                .then((user) => {
                                    user.usercomments.push(comment._id)
                                    user.save()
                                })
                                .then(() => res.status(200).json("Added bug comment!"))
                        })
                        .catch(err => res.status(400).json("Error adding comment " + err))
                })
                .catch(err => res.status(400).json("Error Adding Comment " + err))
        })
})

// MAKE SURE ONLY THE AUTH USER CAN CHANGE THIER OWN COMMENTS
// I created this option to create and delete comments.
// This feature can be added on the client side in the future
//
// @PUT
// Note: The comment id is the same as the user's id that posted the comment
// Route /bugs/:projectid/:bugid/:commentid/edit
router.route("/:projectid/:bugid/:commentid/edit").put((req, res) => {
    // Find the old comment and update to the new comment
    BugComment.findById(req.params.commentid)
        .then(comment => {
            if (comment.userid === req.body.userid) {
            // New user comment
            comment.usercomment = req.body.usercomment
            // Save to database
            comment.save()
                .then(() => res.status(200).json("Comment Updated!"))
                .catch(err => res.status(400).json("Error adding comment " + err))
            } else {
                res.status(400).json("You cannot edit other people's comments")
            }
        })
        .catch(err => res.status(400).json("Error edditing comment! " + err))
})

// MAKE SURE ONLY AUTH USERS CAN DELETE THEIR OWN COMMENT
// I created this option to create and delete comments.
// This feature can be added on the client side in the future
//
// @DELETE
// Note: The comment id is the same as the user's id that posted the comment
// Route /bugs/:projectid/:bugid/:commentid/delete
router.route("/:projectid/:bugid/:commentid/delete").delete(async (req, res) => {
    let userid = await req.body.userid
    let isAuth = false

    await BugComment.findById(req.params.commentid)
        .then((comment) => {
            if (comment.userid === userid) {
                isAuth = true
            } else {
                res.status(400).json("You can't delete other people's comments")
            }
        })

    // Make sure the user is authorized to make changes to the comment
    if (isAuth) {
        // Find the comment and delete in BugComment Collection
        BugComment.findByIdAndDelete(req.params.commentid)
            .catch(err => res.status(400).json("Error edditing comment! " + err))

        // Remove the comment id from the comments array in Bug Collection
        Bug.updateOne({ _id: req.params.bugid }, { "$pull": { "comments": mongoose.Types.ObjectId(req.params.commentid) }}, { safe: true, multi:true })
            .catch(err => res.status(400).json("Error edditing comment! " + err))

        // Remove the comment id from the usercomments array in User Collection
        User.updateOne({ _id: userid }, { "$pull": { "usercomments": mongoose.Types.ObjectId(req.params.commentid) }}, { safe: true, multi:true })
            .then(() => res.status(200).json("Deleted Comment!"))
            .catch(err => res.status(400).json("Error edditing comment! " + err))
    }
})

// @POST
// Route /bugs/delete/:bugid
router.route("/delete/:bugid").post((req, res) => {
    let bugid = req.params.bugid

    User.findOne({ name: req.body.submitter })
        .then(user => {
            user.submittedbugs.pop(bugid)
            user.save()
        })
        .then(() => {
            Project.findOne({ projectname: req.body.assignedproject })
            // Remove the bug from the project
            .then(project => {
                project.bugs.pop(bugid)
                project.save()
            })
        })
        .then(() => {
            User.find({ name: {$in:  req.body.assignedto  }})
            // Remove the assigned bug from each of assigned users 
            .then((data => {
                data.map(a => {    
                    User.findById(a._id)
                        .then(user => {
                            user.assignedbugs.pop(bugid)
                            user.save()
                        })
                })
            }))
        })
        .then(() => {
            Bug.findByIdAndDelete(bugid)
            // Delete the bug in the bugs collection
            .then(() => res.json("Bug Deleted"))
            .catch(err => res.status(400).json("Error " + err))
        })
        .catch(err => res.status(400).send(err))
    //
    // Note:
    // Another way to delete a bug from the project if the project id was passed in the params
    // Project.updateOne({ _id: req.params.projectid }, { "$pull": { "bugs": mongoose.Types.ObjectId(bugid) }}, { safe: true, multi:true })
    //
})

// @GET
// Route /bugs/:projectid
router.route("/projectbugs/:projectid").get((req, res) => {
    let isIdValid = mongoose.Types.ObjectId.isValid(req.params.projectid)
    if (!isIdValid) {
        return res.status(404).send("Error")
    }

    // Test if the project exists before running functions
    let projectTest = Project.findById(req.params.projectid)
    if (projectTest === null) {
        // Send an error if the bug is not found
        return res.status(404).send("Error")
    }

    Project.findById(req.params.projectid)
        .then(project => {
            Bug.find({ _id: {$in:  project.bugs  }})
                .then((data => {
                    res.status(200).send(data)
                }))
                .catch(err => res.status(400).json("Error " + err))
        })
        .catch(err => res.status(404).send(err))
})

// @GET
// Route /bugs/resolvedbugs
router.route("/resolvedbugs/:bugid").get(async (req, res) => {
    // Test if the object id is valid before running functions
    let isBugIdValid = mongoose.Types.ObjectId.isValid(req.params.bugid)
    if (!isBugIdValid) {
        // Send an error if the old bug is not found
        return res.status(404).send("Error")
    }

    // NOTE:
    // Make an extra request to get the comments in the bug
    // This is because only the ID is stored in the comments array,
    // we also need to find the user's information
    let bugIdArray = await OldBug.findById(req.params.bugid)
        .then(bug => {
            return [...bug.comments]
        })

    // Get the comments and assign to a variable
    let bugComments = await BugComment.find({ _id: bugIdArray })
        .then((comment) => {
           return comment
        })
        .catch(err => res.status(404).send("Error finding bug " + err))

    // Find the bug by the id and send with the bugComments
    await OldBug.findById(req.params.bugid)
        .then((bug) => {
            // Create and send an object to make things easier to display on 
            // the front end
            let bugObj = {
                "bug": bug,
                "detailedcomments": bugComments
            }
            res.status(200).send(bugObj)
        })
        .catch(err => res.status(400).send("Error finding bug! " + err))
})

// @GET
// Route /bugs/resolvedbugs
router.route("/resolvedbugs").get((req, res) => {
    OldBug.find()
        .then(bugs => res.json(bugs))
        .catch(err => res.status(400).send("error" + err))
})

// @GET
// Route: /bugs/bugsubmissions/:userid
// Get the bug submissions bugs for the user
router.route("/bugsubmissions/:userid").get((req, res) => {
    User.findById(req.params.userid)
    .then(user => {
        let userBugsArr = user.submittedbugs
        Bug.find({ _id: userBugsArr })
            .then(bugs => {
                res.status(200).send(bugs)
            })
    })
    .catch(() => {
        res.status(400).send("Wow error finding user submitted bugs")
    })
})

// @GET
// Route: /bugs/assignedbugs/:userid
// Get the assigned bugs for the user
router.route("/assignedbugs/:userid").get((req, res) => {
    User.findOne({ _id: req.params.userid })
        .then(user => {
            // Send back an empty array if the user has no assigned bugs
            if (user.assignedbugs.length < 1) {
                return res.status(200).send([])
            }

            Bug.find({ _id: {$in:  user.assignedbugs  }})
                .then((data => {
                    res.status(200).send(data)
                }))
                .catch(() => res.status(400).send("Wow error finding user submitted bugs"))
        })
        .catch(() => res.status(400).send([]))
})

// @GET
// Route /bugs/:bugid
router.route("/:bugid").get(async (req, res) => {
    // Test for valid object id
    let isIdValid = mongoose.Types.ObjectId.isValid(req.params.bugid)
    if (!isIdValid) {
        return res.status(404).send("Error")
    }

    // Test if the bug exists before running functions
    let bugsTest = await Bug.findById(req.params.bugid)
    if (bugsTest === null) {
        // Send an error if the bug is not found
        return res.status(404).send("Error")
    }

    // NOTE:
    // Make an extra request to get the comments in the bug
    // This is because only the ID is stored in the comments array,
    // we also need to find the user's information
    let bugIdArray = await Bug.findById(req.params.bugid)
        .then(bug => {
            return [...bug.comments]
        })
        .catch(err => res.status(400).send("Error finding bug " + err))

    // Get the comments and assign to a variable
    let bugComments = await BugComment.find({ _id: bugIdArray })
        .then((comment) => {
           return comment
        })
        .catch(err => res.status(400).send("Error finding bug " + err))

    // Find the bug by the id and send with the bugComments
    await Bug.findById(req.params.bugid)
        .then((bug) => {
            // Create and send an object to make things easier to display on 
            // the front end
            let bugObj = {
                "bug": bug,
                "detailedcomments": bugComments
            }
            res.status(200).send(bugObj)
        })
        .catch(err => res.status(400).send("Error finding bug! " + err))
})

// @GET
// Route /bugs/
router.route("/").get((req, res) => {
    Bug.find()
        .then(bugs => res.json(bugs))
        .catch(err => res.status(400).send("error" + err))
})

module.exports = router