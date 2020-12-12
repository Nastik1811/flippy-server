const pool = require('../db/index')

module.exports = class Collection{
    constructor({user_id, name}){
        this.user_id = user_id
        this.name = name
    }

    async save(){
        try{
            let collection = await pool.query(
            'INSERT INTO collections (user_id, name, created, last_edited) ' +
            'VALUES ($1, $2, $3, $4) RETURNING *',
            [this.user_id, this.name, new Date(), new Date()])
            return Collection.createModel(collection.rows[0])
        }catch(e){
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
        return data.rows.map(candidate => this.createModel(candidate))
    }

    static async delete({id}){
        try{
            const candidate = await pool.query('DELETE FROM collections WHERE id=$1 RETURNING *', [id])
            return this.createModel(candidate.rows[0])
        }catch (e) {
            throw e
        }

    }

    static async exists({name, user_id}){
        return (await pool.query('SELECT 1 FROM collections WHERE name = $1 AND user_id=$2', [name, user_id])).rowCount > 0
    }
    //add time comparison
    static async getCollectionsToReview({user_id}){
        const data = await pool.query('SELECT collections.id, name, count(1) as cards_number ' +
            'FROM collections INNER JOIN cards ON collections.id = collection_id ' +
            'WHERE collections.user_id=$1 GROUP BY (collections.id, name);'
            , [user_id])

        return data.rows.map(candidate => ({
            id: candidate.id,
            name: candidate.name,
            cards_number: candidate.cards_number
        }))
    }

}