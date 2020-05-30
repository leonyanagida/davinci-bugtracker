require("dotenv").config()
const jwt = require('jsonwebtoken')

const clearToken  = async (req, res, id, name, email) => {
  const token = req.cookies.token || ''
  try {
    if (!token) {
      return res.status(401).json('You need to Login')
    }
    const decrypt = await jwt.verify(token, process.env.REACT_APP_ACCESS_TOKEN_SECRET)

    if (decrypt) {
      return res.clearCookie("token", { path: '/' })
    }


  } catch (err) {
    return res.status(500).json(err.toString())
  }
}

module.exports = clearToken