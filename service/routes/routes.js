import { Deck } from '../models/Deck.js'
import { User } from '../models/User.js'

const isUrl = (value) => {
    const re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
    return re.test(value)
}

const getCardById = async(req, res, next) => {
    try {
        const deck = await Deck.findOne({
            'cards._id': req.params.id
        })
        if (deck) {
            const card = deck.cards.find(card => card._id = req.params.id)
            if (card) {
                res.status(200).json(card)
            } else {
                res.status(404).send(`cannot find card ${req.params.id}`)
            }
        } else {
            res.status(404).send(`cannot find deck associated with card ${req.params.id}`)
        }

    } catch (err) {
        res.status(400).send(err.name + err.message)
    }
}

const updateCardById = async(req, res, next) => {
    const data = req.body
    try {
        const deck = await Deck.findOne({
            'cards._id': req.params.id
        })
        if (deck) {
            const card = deck.cards.find(card => card._id = req.params.id)
            if (card) {
                card.frontImage = data.frontImage ? data.frontImage : card.frontImage
                card.frontText = data.frontText ? data.frontText : card.frontText
                card.backImage = data.backImage ? data.backImage : card.backImage
                card.backText = data.backText ? data.backText : card.backText
                await card.save()
            } else {
                res.status(404).send(`cannot find card ${req.params.id}`)
            }
        } else {
            res.status(404).send(`cannot find deck associated with card ${req.params.id}`)
        }

    } catch (err) {
        res.status(400).send(err.name + err.message)
    }
}

const deleteCardById = async(req, res, next) => {
    const id = req.params.id

    try {
        const deck = await Deck.findOne({
            'cards._id': req.params.id
        })
        if (deck) {
            const card = deck.cards.find(card => card._id = req.params.id)
            if (card) {
                deck.cards.remove(card)
                deck.size = deck.size - 1
                await Deck.save()
            } else {
                res.status(404).send(`cannot find card ${req.params.id}`)
            }
        } else {
            req.status(404).send(`cannot find deck ${req.params.id}`)
        }

    } catch (err) {
        res.status(400).send(err.name + err.message)
    }

}

const getCardsByDeckId = async(req, res, next) => {
    const limit = req.query.limit
    const deck = await Deck.findById(req.params.id)
    if (deck) {
        res.status(200).json(deck.cards.slice(0, limit))
    } else {
        res.status(404).send("cards not found")
    }
}

const getDeckById = async(req, res, next) => {
    const deck = await Deck.findById(req.params.id)
    if (deck) {
        res.status(200).json(deck)
    } else {
        res.status(404).send("deck not found")
    }
}

const updateDeckById = (req, res, next) => {
    res.send(`updating deck ${req.params.id}`)
}

const deleteDeckById = async(req, res, next) => {
    try {
        const deck = await Deck.findByIdAndDelete(req.params.id)
        res.status(204)
    } catch (err) {
        res.status(502).send(err)
    }
}

const getDecksByUser = (req, res, next) => {
    res.send(`getting decks from ${req.params.id}`)
}

const createDeck = async(req, res, next) => {
    const deckReq = req.body

    console.log('creating a new deck')
    console.log(deckReq)
    if (!deckReq.name) {
        res.status(400).send('Deck data incomplete: bad name')
    }
    if (!deckReq.userId) {
        res.status(400).send('Deck data incomplete: no userId')
    }

    try {
        const user = await User.findById(deckReq.userId)
        if (user) {
            const deck = new Deck({
                name: deckReq.name,
                cards: deckReq.cards,
                size: deckReq.size,
                userId: deckReq.userId
            })
            await deck.save()
            res.sendStatus(204)
        } else {
            res.status(404).send('Error creating deck')
        }
    } catch (err) {
        console.log(`Error creating deck ${err}`)
        res.sendStatus(502)
    }
}

const createCard = async(req, res, next) => {
    const cardReq = req.body

    if ((!cardReq.frontImage && !cardReq.frontText) ||
        (!cardReq.backImage && !cardReq.backText)) {
        res.status(400).send('Card data incomplete')
    }

    if ((frontImage && !isUrl(frontImage)) || (backImage && !isUrl(backImage))) {
        res.status(400).send('Image fields must be valid URLs')
    }

    if (!cardReq.deckId) {
        res.status(400).send('Deck ID is required')
    }

    try {
        const deck = await Deck.findById(cardReq.deckId)
        if (deck) {
            deck.cards.push({
                frontImage: cardReq.frontImage,
                frontText: cardReq.frontText,
                backImage: cardReq.backImage,
                backText: cardReq.backText
            })
            await deck.save()
            res.sendStatus(204)
        } else { res.sendStatus(404) }
    } catch (err) {
        console.log(`Error creating card ${err}`)
        res.sendStatus(502)
    }
}

const createUser = async(req, res, next) => {
    const userReq = req.body

    if (!user.firstName || !user.lastName) {
        res.status(400).send('User data incomplete: bad name')
    }

    try {
        const user = new User({
            firstName: req.firstName,
            lastName: req.lastName
        })
        await user.save()
        res.sendStatus(204)
    } catch (err) {
        console.log(`Error createing user ${err}`)
        res.sendStatus(502)
    }
}

const updateUserById = (req, res, next) => {
    console.log(req.body)
    res.send(`updating user ${req.params.id}`)
}

const deleteUserById = (req, res, next) => {
    res.send(`deleting user ${req.params.id}`)
}

export {
    getCardById,
    updateCardById,
    deleteCardById,
    getCardsByDeckId,
    getDeckById,
    updateDeckById,
    deleteDeckById,
    getDecksByUser,
    createDeck,
    createCard,
    createUser,
    updateUserById,
    deleteUserById
}