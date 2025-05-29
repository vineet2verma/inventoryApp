// lib/mongodb.js
import mongoose from 'mongoose'

const MONGO_URL = process.env.MONGO_URL

if (!MONGO_URL) {
  throw new Error('Please define the MONGO_URL environment variable')
}

let cached = global.mongoose // Use global variable to cache the connection

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null } // Initialize cached variable if it doesn't exist
}

async function connectToDatabase () {
  console.log('Connecting to database...') // Log the connection attempt
  if (cached.conn) return cached.conn // Return cached connection if it exists

  if (!cached.promise) {
    // If no promise is cached, create a new one
    cached.promise = mongoose
      .connect(MONGO_URL, {
        useNewUrlParser: true, // Use new URL parser to avoid deprecation warnings
        useUnifiedTopology: true // Use unified topology to avoid deprecation warnings
      })
      .then(mongoose => mongoose) // Return the mongoose instance
  }

  cached.conn = await cached.promise // Wait for the promise to resolve and cache the connection
  return cached.conn
}

export default connectToDatabase
