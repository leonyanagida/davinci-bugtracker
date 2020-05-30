require("dotenv").config()
const jwt = require('jsonwebtoken')

const checkToken = async (req, res, next) => {
  const token = req.cookies.token || ''
  try {
    if (!token) {
      return res.status(401).json('You need to Login')
    }
    const decrypt = await jwt.verify(token, process.env.REACT_APP_ACCESS_TOKEN_SECRET)
    req.user = {
      id: decrypt.id,
      name: decrypt.name,
      email: decrypt.email,
    }
    next()
  } catch (err) {
    return res.status(500).json(err.toString())
  }
};

module.exports = checkToken