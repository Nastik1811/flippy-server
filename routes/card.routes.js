const {Router} = require('express')
const {getCards, createCard, deleteCard, updateCardProgress, deleteCardsCollection, updateCard, getCard} = require('../controllers/cardsController')
const auth = require('../middleware/auth.middleware')
const router = Router()

router.get('/', auth, getCards)
router.get('/:id', auth, getCard)
router.post('/', auth, createCard)
router.put('/progress', auth, updateCardProgress)
router.put('/:id', auth, updateCard)
router.delete('/:id', auth, deleteCard)
router.delete('/', auth, deleteCardsCollection)

module.exports = router