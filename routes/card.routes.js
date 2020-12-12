const {Router} = require('express')
const {getCards, createCard, deleteCard, getCountToReview} = require('../controllers/cardsController')
const auth = require('../middleware/auth.middleware')
const router = Router()

router.get('/', auth, getCards)
router.get('/count', auth, getCountToReview)
router.post('/', auth, createCard)
router.delete('/:id', auth, deleteCard)

module.exports = router