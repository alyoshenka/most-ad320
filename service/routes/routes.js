import { Deck } from '../models/Deck.js'

const isUrl = (value) => {
    const re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
    return re.test(value)
}

const getCardById = async(req, res, next) => {
    console.log('trying to get a card')
    try {
        const card = await Deck.findOne({
            'cards._id': req.params.id
        })
        if (card) {
            res.status(200).send(card)
        } else {
            res.status(404).send(`cannot get card ${req.params.id}`)
        }
    } catch (err) {
        res.status(400).send(err.name + err.message)
    }


}

const updateCardById = (req, res, next) => {
    res.send(`updating card ${req.params.id}`)
}

const deleteCardById = (req, res, next) => {
    res.send(`deleting card ${req.params.id}`)
}

const getCardsByDeckId = async(req, res, next) => {
    const limit = req.query.limit

    // await -> this query should complete, when it does save it to deck
    const deck = await Deck.findById(req.params.id)
    if (deck) {
        res.send(deck.cards) // slice?
    } else {
        res.status(404).send("cards not found")
    }
}

const getDeckById = (req, res, next) => {
    res.send(`getting deck ${req.params.id}`)
}

const updateDeckById = (req, res, next) => {
    res.send(`updating deck ${req.params.id}`)
}

const deleteDeckById = (req, res, next) => {
    res.send(`deleting deck ${req.params.id}`)
}

const getDecksByUser = (req, res, next) => {
    res.send(`getting decks from ${req.user.id}`)
}

const createDeck = (req, res, next) => {
    res.send('creating deck')
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

const createUser = (req, res, next) => {
    res.send('creating user')
}

const updateUserById = (req, res, next) => {
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