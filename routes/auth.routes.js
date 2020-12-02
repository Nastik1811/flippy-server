const {Router} = require('express')
const {createUser, login} = require('../controllers/userController')
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
    '/login',
    [
        check('email', 'Incorrect email').normalizeEmail().isEmail(),
        check('password', 'This filed shouldn\'t be empty').exists()
    ],
    login
)


module.exports = router