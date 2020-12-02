const pool = require('../db')

module.exports = class User{
    constructor(userData){
        this.username = userData.username
        this.email = userData.email
        this.password = userData.password
    }

    async save(){
        const user = await pool.query(
            'INSERT INTO USERS (username, email, password, created) ' +
            'VALUES ($1, $2, $3, $4) RETURNING user_id',
            [this.username, this.email, this.password, new Date()]
        )
    }

    static async findOne({id}){
        const candidate = await pool.query('SELECT 1 FROM users WHERE id= $1', [id])

    }

    static async exists({email}){
        return (await pool.query('SELECT 1 FROM users WHERE email= $1', [email])).rowCount > 0
    }
}