const router = require("express").Router()
const bcrypt = require('bcrypt');
let User = require("../models/user.model")
const verifyToken = require("../auth/verifyToken")
const generateToken = require("../auth/generateToken")
const clearToken = require("../auth/clearToken")

// @POST
// Route: /users/login
router.route("/login").post((req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
  
    User.findOne({ email }).then(user => {
      // Check the token if the login credentials are incorrect
      // Token will be false if the password is incorrect
      if (!user || user === null) {
        return res.status(400).json({
          success: false,
          message: "Failed"
        })
      }
  
      bcrypt
        .compare(password, user.password)
        .then(isMatch => {
          // Check if username and password are correct
          if (isMatch) {
            const id = user._id
            const name = user.name
            const email = user.email
            // Generate login
            generateToken(res, id, name, email)
            // carry out other actions after generating token like sending a response)
            return res.status(200).send({id, name, email})
          } else {
            return res.status(400).send({ error: "Invalid Credentials" })
          }
        })
        .catch(() => res.status(400).send("Error logging in"))
    })
})

// @POST
// Route: /users/guestlogin
router.route("/guestlogin").post(async (req, res, next) => {
    try {
        const userId = await req.body.id
        // get user details based on the login parameters
        let guestUser = await User.findById(userId)
        const id = guestUser._id
        const name = guestUser.name
        const email = guestUser.email

        await generateToken(res, id, name, email)
        // carry out other actions after generating token like sending a response);
        return res.status(200).send({id, name, email})
    } catch (err) {
      return res.status(500).send(err.toString())
    }
})

// @POST
// Route: /users/signout
router.route("/signout").post(async (req, res, next) => {
    try {
        const userId = await req.body.id
        const userName = await req.body.name
        const userEmail = await req.body.email

        await clearToken(req, res, userId, userName, userEmail)
        // carry out other actions after generating token like sending a response);
        return res.status(200).send("Success!")
    } catch (err) {
      return res.status(500).send(err.toString())
    }
})

// @POST
// Route: /users/register
router.route("/register").post((req, res, next) => {
    const email = req.body.email
    const name = req.body.name
    const password = req.body.password
    // Password2 on client and server side
    const password2 = req.body.password2

    // Client side check if passwords match
    if (password !== password2) {
        return res.status(400).send("passwords do not match!")
    }

    {
        User.findOne({ email:email }).then((currentUser) => {
	        if (currentUser) {
                return res.status(400).send("User already exists")
            } else {
                const newUser = new User({
                    name: name,
                    email:email,
                    password: password
                })
                
                // Hash and salt passwords
                bcrypt.genSalt(10, (err, salt) => {
                    if (err) throw err

                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        // Check for errors
                        if (err) throw err
                        // Store hash in password DB
                        newUser.password = hash
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(() => res.status(400).send("Unable to register new account"))
                    })
                })
                return res.status(200).send("Success")
	        }
        })
	}
})

// @POST
// Route: /users/add
// Add a new user to the bug tracker
router.route("/add").post(verifyToken, (req, res) => {
    const email = req.body.email
    const name = req.body.name
    const newUser = new User({ email, name })
    
    newUser.save()
        .then(() => res.json("User Added!"))
        .catch(err => res.status(400).send("Error Adding User " + err))
})

// @POST
// Route: /users/add
// Deletes a user from the bug tracker
router.route("/delete/:userid").post(verifyToken, (req, res) => {
    User.findByIdAndDelete(req.params.userid)
        .then(() => res.json("User Deleted"))
        .catch(err => res.status(400).send("Unable to delete user! " + err))
})

// @GET
// Route: /users/
// Get a specific user data
router.route("/:userid").get(verifyToken, (req, res) => {
    User.findById(req.params.userid)
        .then(user => {

            let userObj = {
                name: user.name,
                id: user._id,
                email: user.email
            }

            res.json(userObj)
        })
        .catch(err => res.status(400).send("Error" + err))
})

// @GET
// Route: /users/
// Get a list of all the users in the bug tracker
router.route("/").get(verifyToken, (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).send("Error" + err))
})

module.exports = router