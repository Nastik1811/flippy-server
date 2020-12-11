const {Router} = require('express')
const {getCards, createCard} = require('../controllers/cardsController')
const auth = require('../middleware/auth.middleware')
const router = Router()

router.get('/', auth, getCards)

module.exports = router