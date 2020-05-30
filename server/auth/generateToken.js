require("dotenv").config()
const express = require('express')
const jwt = require('jsonwebtoken')

const generateToken = (res, id, name, email) => {
    const token = jwt.sign({ id, name, email }, process.env.REACT_APP_ACCESS_TOKEN_SECRET, {
      expiresIn: "1h"
    })
    return res.cookie('token', token, {
      expires: new Date(Date.now() + 3600000), // 1 Hour
      secure: true, // set to true if your using https
      httpOnly: true,
    })
}

module.exports = generateToken
