const pool = require('../db')

module.exports = class User{
    constructor({username, email, password}){
        this.username = username
        this.email = email
        this.password = password
    }

    async save(){
        const user = await pool.query(
            'INSERT INTO USERS (username, email, password, created) ' +
            'VALUES ($1, $2, $3, $4) RETURNING user_id',
            [this.username, this.email, this.password, new Date()]
        )
    }

    static async findOne({id, email}){
        let candidate;
        if(id){
            candidate = await pool.query('SELECT * FROM users WHERE id=$1 FETCH FIRST ROW ONLY', [id])
        }else if(email){
            candidate = await pool.query('SELECT * FROM users WHERE email=$1 FETCH FIRST ROW ONLY', [email])
        }
        else{
            return null
        }

        if(candidate.rowCount === 0) return null

        return {
            id: candidate.rows[0].id,
            username: candidate.rows[0].username,
            email: candidate.rows[0].email,
            password: candidate.rows[0].password
        }
    }

    static async exists({email}){
        return (await pool.query('SELECT 1 FROM users WHERE email= $1', [email])).rowCount > 0
    }
}