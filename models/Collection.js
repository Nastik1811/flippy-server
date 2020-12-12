const pool = require('../db/index')

module.exports = class Collection{
    constructor({user_id, name}){
        this.user_id = user_id
        this.name = name
    }

    async save(){
        try{
            return await pool.query(
            'INSERT INTO collections (user_id, name, created, last_edited) ' +
            'VALUES ($1, $2, $3, $4)',
            [this.user_id, this.name, new Date(), new Date()]
        )}catch(e){
            throw e
        }
    }
    static createModel(candidate){
        return {
            id: candidate.id,
            name: candidate.name,
            last_edited: candidate.last_edited,
            created: candidate.created
        }
    }
    static async findOne({id, name, user_id}){
        let candidate;
        if(id){
            candidate = await pool.query('SELECT * FROM collections WHERE id=$1 AND user_id=$2 FETCH FIRST ROW ONLY', [id, user_id])
        }
        else if(name){
            candidate = await pool.query('SELECT * FROM collections WHERE name=$1 AND user_id=$2 FETCH FIRST ROW ONLY', [name, user_id])
        }
        else{
            return null
        }

        if(candidate.rowCount === 0) return null

        return this.createModel(candidate.rows[0])
    }

    static async find({user_id}){
        const data = await pool.query('SELECT * FROM collections WHERE user_id=$1', [user_id])
        console.log(user_id)
        return data.rows.map(candidate => this.createModel(candidate))
    }

    static async exists({name, user_id}){
        return (await pool.query('SELECT 1 FROM collections WHERE name = $1 AND user_id=$2', [name, user_id])).rowCount > 0
    }

}