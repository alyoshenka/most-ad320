import { Router } from 'express'
import { User } from '../models/User.js'
import {
  sanitizeUser,
  sanitizeUsers,
  isAdmin,
  isSuperuser,
  isUser
} from '../authorization/authorization.js'

const usersRouter = Router()


const getUsers = async (req, res) => {
  try {
    const users = await User.find({})
    res.send(sanitizeUsers(users))
  } catch (err) {
    console.log(`Error getting users: ${err}`)
    res.sendStatus(500)
  }  
}

const getUsersById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    res.send(sanitizeUser(user))
  } catch (err) {
    console.log(`Error getting user by id: ${err}`)
    res.sendStatus(500) // todo: correct status code?
  }
}

const updateUser = async (req, res) => {
  const result = await User.findByIdAndUpdate(req.params.id, req.body)
  console.log('result ', result)
  res.sendStatus(503)
}

const deleteUser = async (req, res) => {
  const result = await User.findByIdAndUpdate(req.params.id, { active: false })
  console.log('result ', result)
  res.sendStatus(503)
}

usersRouter.get('/', isSuperuser, getUsers) 
usersRouter.get('/:id', isSuperuser, getUsersById)
usersRouter.put('/:id', updateUser) // todo: check route
usersRouter.delete('/:id', deleteUser) // todo: check route

export default usersRouter
