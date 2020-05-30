const mongoose = require('mongoose')
require('dotenv').config()

const uri = process.env.REACT_APP_ATLAS_URI
mongoose
    .connect(uri, { useNewUrlParser: true, useCreateIndex: true,  useUnifiedTopology: true })
    .catch(e => console.error("Connection Error", e.message))

const db = mongoose.connection
db.once('open', () => {
  console.log("MongoDB database connection established successfully")
})

module.exports = db