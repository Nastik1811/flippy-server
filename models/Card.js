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
            collection_id: candidate.collection_id,
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
    static async findOne({id}){
        let candidate
        if(id){
            candidate = await pool.query('SELECT * FROM cards WHERE id=$1 FETCH FIRST ROW ONLY', [id])
        }
        else{
            return null
        }

        if(candidate.rowCount === 0) return null

        return this.createModel(candidate.rows[0])
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

    static async deleteCardsCollection({collection_id}){
        try{
            const data = await pool.query('DELETE FROM cards WHERE collection_id=$1 RETURNING *', [collection_id])
            return data.rows.map(candidate => this.createModel(candidate))
        }catch (e) {
            throw e
        }
    }

    static async getCards({user_id, collection_id, needReview}){
        let data
        if(collection_id && needReview){
            data = await pool.query('SELECT * FROM cards ' +
                'WHERE user_id=$1 AND collection_id=$2 AND scheduled_review < now()', [user_id, collection_id])
        }else if(collection_id){
            data = await pool.query('SELECT * FROM cards WHERE user_id=$1 AND collection_id=$2', [user_id, collection_id])
        }else if(needReview) {
            data = await pool.query('SELECT * FROM cards WHERE user_id=$1 AND scheduled_review < now()', [user_id])
        }else{
            data = await pool.query('SELECT * FROM cards WHERE user_id=$1', [user_id])
        }
        return data.rows.map(candidate => this.createModel(candidate))
    }

    static async updateCardDetails({id, collection_id, front, back}){
        try{
            const candiadte = await pool.query(
                'UPDATE cards SET collection_id=$1, front=$2, back=$3, last_edited=$4 WHERE id=$5 RETURNING *',
                [collection_id, front, back, new Date(), id]
            )
            return this.createModel(candiadte.rows[0])

        }catch (e) {
            throw e
        }
    }

    static async updateCardProgress({id, currentDateTime, nextReviewDate, newStatus}){
        try{
            if(newStatus){
                const candiadte = await pool.query(
                    'UPDATE cards SET status=$1, scheduled_review=$2, last_review=$3 WHERE id=$4 RETURNING *',
                    [newStatus, nextReviewDate, currentDateTime, id]
                )
                return this.createModel(candiadte.rows[0])
            }else {
                await pool.query(
                    'UPDATE cards SET scheduled_review = $1, last_review=$2 WHERE id=$3',
                    [nextReviewDate, currentDateTime, id]
                )
            }
        }catch (e) {
            throw e
        }
    }
}