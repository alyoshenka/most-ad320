import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

// need '.js' here
import { Deck } from './models/Deck.js'

const app = express()
const port = 8000

const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@notablecluster.sm4hi.mongodb.net/Notable?retryWrites=true&w=majority`

try {
    await mongoose.connect(connectionString)
} catch (err) {
    console.log('error ', err)
}

const exampleMiddleware = (req, res, next) => {
    console.log('example middleware')
    next()
}

app.use(cors())
app.use(express.json())
app.use(exampleMiddleware)


// routes

app.get('/', (req, res) => {
    res.send('hello world')
})

app.get('/decks/:id/cards', async(req, res) => {
    const limit = req.query.limit

    // await -> this query should complete, when it does save it to deck
    const deck = await Deck.findById(req.params.id)
    if (deck) {
        res.send(deck.cards) // slice?
    } else {
        res.status(404).send("cards not found")
    }

})

const cardsById = async(req, res) => {
    const card = await Deck.findOne({
        'cards._id': req.params.id
    })
    res.status(200).send(card)
}

app.get('/cards/:id', cardsById)

const isUrl = (value) => {
    const re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
    return re.test(value)
}

app.post('/cards', async(req, res) => {
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
})

app.listen(port, () => { console.log(`Example app listening on port ${port}`) })