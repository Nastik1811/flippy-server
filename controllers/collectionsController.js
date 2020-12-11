const Collection = require('../models/Collection')

const createCollection = async (req, res) => {
    try{
        const {user_id, name}  = req.body
        if(Collection.exists({name, user_id})){
            return res.status(500).json({message: "Collection with the same name is already exists"})
        }
        const collection = new Collection({user_id, name}) .save()
        console.log(card)

        return res.status(201).json({message: "Success!"})
    }catch (e) {
        return res.status(500).json({message: 'Something went wrong... Please, try again.'})
    }
}

const getCollections = async (req, res) => {
    try{
        const {user_id}  = req.body
        if(Collection.exists({name, user_id})){
            return res.status(500).json({message: "Collection with the same name is already exists"})
        }
        const collection = new Collection({user_id, name}) .save()
        console.log(card)

        return res.status(201).json({message: "Success!"})
    }catch (e) {
        return res.status(500).json({message: 'Something went wrong... Please, try again.'})
    }
}

