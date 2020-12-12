const {Router} = require('express')
const {getCollections, createCollection } = require('../controllers/collectionsController')
const auth = require('../middleware/auth.middleware')
const router = Router()

router.get('/', auth, getCollections)
router.post('/', auth, createCollection)

module.exports = router