const pool = require('../db/')
const bcrypt = require('bcrypt')
const User = require('../models/User')

const createUser = async (req, res) => {
    const {email, password, username} = req.body
    const exists = User.exists({email})

    if (exists) {
        return res.status(400).json({ message: 'The email already exist. Please try with a different email.' })
    }
}