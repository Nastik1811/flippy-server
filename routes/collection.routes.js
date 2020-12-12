const {Router} = require('express')
const {getCollections, createCollection, deleteCollection, getCollectionsToReview} = require('../controllers/collectionsController')
const auth = require('../middleware/auth.middleware')
const router = Router()

router.get('/', auth, getCollections)
router.get('/needReview', auth, getCollectionsToReview)
router.post('/', auth, createCollection)
router.delete('/:id', auth, deleteCollection)

module.exports = router