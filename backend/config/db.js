// server/config/db.js
// Handles MongoDB connection using Mongoose.
// Called once at server startup — all models share this single connection.

const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options suppress deprecation warnings in Mongoose 7+
      // (they are the defaults, but being explicit is good practice)
    })

    console.log(`✅ MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    // Log the error clearly, then exit.
    // We exit because the app is useless without a database.
    console.error(`❌ MongoDB connection failed: ${error.message}`)
    process.exit(1)
  }
}

module.exports = connectDB
