import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
})

export const User = mongoose.model('User', UserSchema)