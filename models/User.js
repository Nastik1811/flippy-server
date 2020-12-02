const pool = require('../db')

module.exports = class User{
    constructor(username, email, password){
        this.username = username
        this.email = email
        this.password = password
    }
    static findOne({email}){
        return
    }

    static async exists({email}){
        return (await pool.query('SELECT 1 FROM users WHERE email= $1', [email])).rowCount > 0
    }
}