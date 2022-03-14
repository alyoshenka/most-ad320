import { User } from '../models/User.js'


export function sanitizeUser(user) {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    decks: user.decks,
    active: user.active
  }
}

export function sanitizeUsers(users) {
  return users.map((user) => sanitizeUser(user))
}

export function atOrAboveRole(myRole, roleToCheckAgainst) {
    if (myRole === roleToCheckAgainst) {
        return true
    } else if (roleToCheckAgainst === 'user') {
        return myRole === 'superuser' || myRole === 'admin'
    } else if (roleToCheckAgainst === 'superuser') {
        return myRole === 'admin' 
    } else {
        return false
    }
}

// todo: simplify code

export async function isAdmin(req, res, next) {
    const { userId } = req.user
    try {
        const requestor = await User.findById(userId)
        const role = requestor.role[0]
        if (atOrAboveRole(role, 'admin')) {
            next()
        } else {
            res.status(403).send('Forbidden')
        }
    } catch (err) {
        console.log(`Error checking for admin: ${err}`)
        res.sendStatus(500)
    }   
}

export async function isSuperuser(req, res, next) {
    const { userId } = req.user
    try {
        const requestor = await User.findById(userId)
        const role = requestor.role[0]
        if (atOrAboveRole(role, 'superuser')) {
            next()
        } else {
            res.status(403).send('Forbidden')
        }
    } catch (err) {
        console.log(`Error checking for superuser: ${err}`)
        res.sendStatus(500)
    }
}

export async function isUser(req, res, next) {
    const { userId } = req.user
    try {
        const requestor = await User.findById(userId)
        const role = requestor.role[0]
        if (atOrAboveRole(role, 'user')) {
            next()
        } else {
            res.status(403).send('Forbidden')
        }
    } catch (err) {
        console.log(`Error checking for user: ${err}`)
        res.sendStatus(500)
    }
}

export async function isAdminOrSuperItself(req, res, next) { 
    const { userId } = req.user
    const toDeleteId = req.params.id
    if (!userId) {
        console.log(`${isAdminOrSuperItself.name}: no userId`)
        res.sendStatus(400)
        return
    }
    if (!toDeleteId) {
        console.log(`${isAdminOrSuperItself.name}: no id parameter`)
        res.sendStatus(400)
        return
    }
    try {
        const requestor = await User.findById(userId)
        const role = requestor.role[0]
        if (atOrAboveRole(role, 'admin')) {
            next()
        } else if (atOrAboveRole(role, 'superuser') && userId === toDeleteId) {
            next()
        } else {
            res.status(403).send('Forbidden')
        }
    } catch (err) {
        console.log(`Error checking role of user: ${err}`)
        res.sendStatus(500)
    }
}

// todo: redundancy here

export async function isSuperOrUserItself(req, res, next) {
    const { userId } = req.user
    const paramId = req.params.id
    if (!userId) {
        console.log(`${isSuperOrUserItself.name}: no userId`)
        res.sendStatus(400)
        return
    }
    if (!paramId) {
        console.log(`${isSuperOrUserItself.name}: no id parameter`)
        res.sendStatus(400)
        return
    }
    try {
        const requestor = await User.findById(userId)
        const role = requestor.role[0]
        if (atOrAboveRole(role, 'superuser')) {
            next()
        } else if (atOrAboveRole(role, 'user') && userId === paramId) {
            next()
        } else {
            res.status(403).send('Forbidden')
        }
    } catch (err) {
        console.log(`Error checking user: ${err}`)
        res.sendStatus(500)
    }
}