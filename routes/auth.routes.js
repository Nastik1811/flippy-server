const {Router} = require('express')
const {createUser} = require('../controllers/userController')
const router = Router()
const {check, validationResult} = require('express-validator')


router.post(
    '/signup',
    [
        check('email', 'Incorrect email').isEmail(),
        check('password', 'Password shouldn\'t be shorter then 6 symbols').isLength({ min: 6 })
    ],
    createUser
)

router.post(
    '/login'
)


module.exports = router