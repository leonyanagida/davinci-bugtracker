const mongoose = require("mongoose")
const router = require("express").Router()
const Project = require("../models/project.model")
const User = require("../models/user.model")

// @POST
// Route: /projects/add
router.route("/add").post((req, res) => {
    const description = req.body.description
    const projectmanager = req.body.projectmanager
    const projectname = req.body.projectname

    const newProject = new Project({ description, projectmanager, projectname })
    newProject.save()
        .then((project) => {
            User.findOne({ name: projectmanager })
                .then((user) => {
                    user.assignedprojects.push(project._id)
                    user.save()
                })
                .then(() => res.status(200).json("Added project!!"))
        })
        .catch(err => res.status(400).json("Error adding project " + err))
})

// @POST
// Route: /projects/update/:projectid
router.route("/update/:projectid").post((req, res) => {
    let isIdValid = mongoose.Types.ObjectId.isValid(req.params.projectid)
    if (!isIdValid) {
        return res.status(404).send("Error")
    }

    Project.findById(req.params.projectid)
        .then(project => {
            project.description = req.body.description;
            project.projectmanager = req.body.projectmanager;
            project.projectname = req.body.projectname;

            project.save()
                .then(() => res.json("Project Updated!"))
                .catch(err => res.status(400).json("Error updating project! " + err))
        })
        .catch(err => res.status(400).json("Error " + err))
})

// @GET
// Route: /projects/assignedprojects/:userid
// Get the assigned projects for the user
router.route("/assignedprojects/:userid").get((req, res) => {
    let isIdValid = mongoose.Types.ObjectId.isValid(req.params.userid)
    if (!isIdValid) {
        return res.status(404).send("Error")
    }

    User.findById(req.params.userid)
        .then(user => {
            if (user.assignedprojects.length < 1) {
                return res.status(200).send([])
            }
            Project.find({ _id: {$in: user.assignedprojects } })
                .then((data => {
                    res.status(200).send(data)
                }))
                .catch(err => res.status(400).json("Error " + err))

        })
        .catch(() => res.status(400).send([]))
})

// @GET
// Route: /projects/:project
// Search for the name of any project or searching the project manager
// We achieve this by createing an index the Project collection for the projectname
router.route("/search/:project").get((req ,res) => {
    Project.find({ $text: { $search: req.params.project } })
        .then(project => {
            res.status(200).send(project)
        })
        .catch(err => res.status(400).json(`Could not find project ${req.params.project}: ${err}`))
})

// @GET
// Route: /projects/:projectid
router.route("/:projectid").get((req ,res) => {
    let isIdValid = mongoose.Types.ObjectId.isValid(req.params.projectid)
    if (!isIdValid) {
        return res.status(404).send("Error")
    }

    Project.findById(req.params.projectid)
        .then(project => res.send(project))
        .catch(err => res.status(400).send("Error " + err))
})

// @GET
// Route: /projects/
// Gets all the projects
router.route("/").get((req, res) => {
    Project.find()
        .then(projects => res.json(projects))
        .catch(err => res.status(400).json("Error finding projects" + err))
})

module.exports = router