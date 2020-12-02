const pool = require('../db/')
const bcrypt = require('bcrypt')
const config = require('config')
const User = require('../models/User')
const {check, validationResult} = require('express-validator')
const {jwt} = require('jsonwebtoken')

const createUser = async (req, res) => {
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect data format'
            })
        }
        const {email, password, username} = req.body
        const exists = await User.exists({email})

        if (exists) {
            return res
                .status(400)
                .json({ message: 'This email address is already being used. Please, try with a different email.' })
        }
        const hashedPassword = await bcrypt.hash(password, 12)
        const user = new User({username, password: hashedPassword, email})
        await user.save()

        return res.status(201).json({message: "Success! User has been created!"})
    }catch (e) {
        return res.status(500).json({message: 'Something went wrong... Please, try again.'})
    }

}

const login = async (req, res) => {
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: 'Incorrect data format'
            })
        }
        const {email, password} = req.body
        const user = await User.findOne({email})

        if (!user) {
            return res
                .status(400)
                .json({ message: 'This email address is not registered yet.' })
        }

        const isPasswordsMatch = await bcrypt.compare(password, user.password)
        if(!isPasswordsMatch){
            return res
                .status(400)
                .json({ message: 'Wrong password. Please, try again.' })
        }
        const token = jwt.sign(
            {
                userId: user.id
            },
            config.get('jwtSecret'),
            {expiresIn: '1h'}
        )

        return res.json({token, userId: user.id})

    }catch (e) {
        return res.status(500).json({message: 'Something went wrong... Please, try again.'})
    }

}

module.exports = {
    createUser,
    login
}