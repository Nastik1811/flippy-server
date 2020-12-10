const pool = require('../db')

module.exports = class Collection{
    constructor({user_id, name}){
        this.user_id = user_id
        this.name = name
    }

    async save(){
        try{ 
            await pool.query(
            'INSERT INTO collectons (user_id, name, created, last_edited) ' +
            'VALUES ($1, $2, $3, $4)',
            [this.user_id, this.name, new Date(), new Date()]
        )}catch(e){
            throw e
        }
    }

    static async findOne({id}){
        let candidate;
        if(id){
            candidate = await pool.query('SELECT * FROM collections WHERE id=$1 FETCH FIRST ROW ONLY', [id])
        }
        else{
            return null
        }

        if(candidate.rowCount === 0) return null

        return {
            id: candidate.rows[0].id,
            user_id: candidate.rows[0].user_id,
            name: candidate.rows[0].email,
            last_edited: candidate.rows[0].last_edited,
            created: candidate.rows[0].created
        }
    }

}