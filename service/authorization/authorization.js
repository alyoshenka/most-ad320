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
        res.sendStatus(500) // todo: correct status code?
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
        res.sendStatus(500) // todo: correct status code?
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
        res.sendStatus(500) // todo: correct status code?
    }
}

export async function isAdminOrSuperItself(req, res, next) { 
    const { userId } = req.user
    const toDeleteId = req.params.id
    if (!userId) {
        console.log('no userId')
        res.sendStatus(500) // todo: error code?
    }
    if (!toDeleteId) {
        console.log('no id parameter')
        res.sendStatus(500) // todo: correct error code?
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
        console.log(`Error deleting user: ${err}`)
        console.sendStatus(500) // todo: error code
    }
}

// todo: redundancy here

export async function isSuperOrUserItself(req, res, next) {
    const { userId } = req.user
    const paramId = req.params.id
    if (!userId) {
        console.log('no userId')
        res.sendStatus(500) // todo: error code?
    }
    if (!paramId) {
        console.log('no id parameter')
        res.sendStatus(500) // todo: correct error code?
    }
    try {
        const requestor = await User.findById(userId)
        const role = requestor.role[0]
        console.log(role)
        console.log(userId)
        console.log('check: ' + req.idCheck)
        if (atOrAboveRole(role, 'superuser')) {
            // next()
            res.sendStatus(200)
        } else if (atOrAboveRole(role, 'user') && userId === paramId) {
            // next()
            res.sendStatus(200)
        } else {
            res.status(403).send('Forbidden')
        }
    } catch (err) {
        console.log(`Error checking user: ${err}`)
        console.sendStatus(500) // todo: error code
    }
}

export async function deckIdBelongsToUser(req, res, next) {

}

// I kind of like this one, it seems more extensible when dealing with users, decks, and cards
export async function addIdToCheckParameter(req, res, next) {

}
export async function addIdParamCard(req, res, next) {
    
}
export async function addIdParamDeck(req, res, next) {

}
export async function addIdParamUser(req, res, next) { 
    const { userId } = req.user
    const paramId = req.params.id
    req.idCheck = paramId
    next()
}