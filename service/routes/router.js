import express from 'express'
const router = express.Router()

import {
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
} from './routes.js'

router.route('/cards/:id')
    .get(getCardById) // paginate
    .put(updateCardById)
    .delete(deleteCardById)

router.route('/decks/:id')
    .get(getDeckById)
    .put(updateDeckById)
    .delete(deleteDeckById)

router.route('/decks/:id/cards')
    .get(getCardsByDeckId)

router.route('/users/:id/decks')
    .get(getDecksByUser)

router.route('/decks')
    .post(createDeck)

router.route('/cards')
    .post(createCard)

router.route('/users')
    .post(createUser)

router.route('/users/:id')
    .put(updateUserById)
    .delete(deleteUserById)

// module.exports.router = router;
export { router }