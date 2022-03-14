import { Router } from 'express'
import { body } from 'express-validator'
import { User } from '../models/User.js'
import {
  isSuperOrUserItself,
  addIdParamUser
} from '../authorization/authorization.js'

const decksRouter = Router()

// todo: take out extraneous console.logs

const getDecks = async (req, res) => {
  const { userId, other } = req.user
  console.log(`Other data from the token ${other}`)
  try {
    const user = await User.findById(userId)
    console.log(user)
    if (user) {
      res.send(user.decks)
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    console.log(`${getDecks.name}: ${err}`)
    res.sendStatus(500)
  }
}

const createDeck = async (req, res) => {
  const { userId } = req.user
  const newDeck = req.body
  try {
    const user = await User.findById(userId)
    user.decks.push({
      name: newDeck.name,
      cards: []
    })
    await user.save()
    res.sendStatus(204)
  } catch (err) {
    console.log(`${createDeck.name}: ${err}`)
    res.sendStatus(500)
  }
}

const createCard = async (req, res) => {
  const { userId } = req.user
  const deckId = req.params.id
  const newCard = req.body
  try {
    const user = await User.findById(userId)
    const deck = user.decks.id(deckId)
    deck.cards.push(newCard)
    await user.save()
    const newId = deck.cards[deck.cards.length - 1]
    res.status(200).send(newId._id)
  } catch (err) {
    console.log(`${createCard.name}: ${err}`)
    res.sendStatus(500)
  }
}

const deleteDeck = async (req, res) => {
  const { userId } = req.user
  const deckId = req.params.id
  try {
    const user = await User.findById(userId)
    const removedDeck = user.decks.id(deckId).remove()
    console.log(removedDeck)
    user.save()
    res.sendStatus(204)
  } catch (err) {
    console.log(`${deleteDeck.name}: ${err}`)
    res.sendStatus(500)
  }
}

const updateDeck = async (req, res) => {
  const { userId } = req.user
  const deckId = req.params.id
  const newDeck = req.body
  console.log(req.params)
  try {
    const user = await User.findById(userId)
    const deck = user.decks.id(deckId)
    deck.name = newDeck.name
    await user.save()
    res.sendStatus(204)
  } catch (err) {
    console.log(`${updateDeck.name}: ${err}`)
    res.sendStatus(500)
  }
}

decksRouter.get('/', getDecks) // todo: check route
decksRouter.post('/', body('name').not().isEmpty(), createDeck) // todo: check route
decksRouter.put(
  '/:id',
  // this is not working because param.id is the user id, not the deck id
  // so I can add another parameter, id-to-check, but that seems like it will break stuff
  // what other solutions can I come up with?
  addIdParamUser,
  isSuperOrUserItself, // todo: correct order?
  body('name').not().isEmpty(),
  updateDeck
) 
decksRouter.delete('/:id', deleteDeck) // todo: check route

decksRouter.post(
  '/:id/cards',
  body('frontImage').isURL(),
  body('frontText').not().isEmpty(),
  body('backImage').isURL(),
  body('backText').not().isEmpty(),
  createCard
) // todo: check route

export default decksRouter
