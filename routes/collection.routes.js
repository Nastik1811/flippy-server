const {Router} = require('express')
const {getColllectons, createCollection } = require('../controllers/collectionsController')
const auth = require('../middleware/auth.middleware')
const router = Router()

router.get('/', auth, getColllectons)
router.post('/', auth, createCollection)

module.exports = router