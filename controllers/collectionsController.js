const Collection = require('../models/Collection')

const createCollection = async (req, res) => {
    try{
        const {name}  = req.body
        const user_id = req.user.userId
        const exists = await Collection.exists({name, user_id})

        if(exists){
            return res.status(500).json({message: "Collection with the same name is already exists"})
        }
        const collection = new Collection({user_id, name})

        await collection.save()

        return res.status(201).json({message: "Success!"})
    }catch (e) {
        return res.status(500).json({message: e.message | 'Something went wrong... Please, try again.'})
    }
}

const getCollections = async (req, res) => {
    try{
        const user_id = req.user.userId
        const collections = await Collection.find({user_id})
        return res.status(201).json({collections})

    }catch (e) {
        return res.status(500).json({message: 'Something went wrong... Please, try again.'})
    }
}

module.exports = {
    createCollection,
    getCollections
}

