const pool = require('../db/')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const {check, validationResult} = require('express-validator')

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
        const exists = User.exists({email})

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

module.exports = {
    createUser
}