import { Router } from 'express'
import { User } from '../models/User.js'

const usersRouter = Router()

function sanitizeUsers(user) {
  const sanitizedUsers = users.map((user) => ({
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    decks: user.decks,
    active: user.active
  }))
  return sanitizeUsers
}

const getUsers = async (req, res) => {
  const { userId } = req.user
  const requestor = await User.findById(userId)
  if (requestor.role === 'admin' || requestor.role === 'superuser') {
    const users = await User.find({})
    res.send(sanitizeUsers(users))
  } else {
    res.status(403).send('Forbidden')
  }  
}

const getUsersById = async (req, res) => {
  const user = await User.findById(req.params.id)
  res.send(user)
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

usersRouter.get('/', getUsers)
usersRouter.get('/:id', getUsersById)
usersRouter.put('/:id', updateUser)
usersRouter.delete('/:id', deleteUser)

export default usersRouter
