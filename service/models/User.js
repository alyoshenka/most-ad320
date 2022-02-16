import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    userId: mongoose.Types.ObjectId
})

export const User = mongoose.model('User', UserSchema)