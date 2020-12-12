const pool = require('../db/index')

module.exports = class Card{
    constructor({user_id, collection_id, front, back}){
        this.user_id = user_id
        this.collection_id = collection_id
        this.front = front
        this.back = back
    }

    async save(){
        try{ 
            return await pool.query(
            'INSERT INTO cards (user_id, collection_id, front, back, created, status, scheduled_review) ' +
            'VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [this.user_id, this.collection_id, this.front, this.back, new Date(), 'new', new Date()]
        )}catch(e){
            throw e
        }
    }

    static createModel(candidate){
        return {
            id: candidate.id,
            collection:{
                id: candidate.collection_id,
                name: candidate.collection_name
            },
            front: candidate.front,
            back: candidate.back,
            created: candidate.created,
            status: candidate.status,
            last_review: candidate.last_review,
            scheduled_review: candidate.scheduled_review,
            last_edited: candidate.last_edited
        }
    }
//join with collections
    static async findOne({id, user_id}){
        let candidate
        if(id){
            candidate = await pool.query('SELECT * FROM cards WHERE id=$1 AND user_id=$2 FETCH FIRST ROW ONLY', [id, user_id])
        }
        else{
            return null
        }

        if(candidate.rowCount === 0) return null

        return this.createModel(candidate)
    }

    static async find({user_id}){
        const data = await pool.query('SELECT * FROM cards WHERE user_id=$1', [user_id])
        return data.rows.map(candidate => this.createModel(candidate))
    }

    static async delete({id}){
        try{
            const candidate = await pool.query('DELETE FROM cards WHERE id=$1 RETURNING *', [id])
            return this.createModel(candidate.rows[0])
        }catch (e) {
            throw e
        }
    }
}