const Card = require('../models/Card')

//getCardById
//getCardsGroupByCollection ???
//getCardsNeedRepetition
//

const createCard = async (req, res) => {
    try{
        const {collection_id, front, back}  = req.body
        const user_id = req.user.userId

        const card = new Card({user_id, collection_id, front, back})
        await card.save()


        return res.status(201).json({message: "Success!"})
    }catch (e) {
        return res.status(500).json({message: e.message})
    }
}

const getCards = async (req, res) => {
    try{
        const user_id = req.user.userId
        const cards = await Card.find({user_id})
        return res.status(201).json({cards})
    }catch (e) {
        return res.status(500).json({message: e.message})
    }
}

const deleteCard = async (req, res) => {
    try{
        const card = await Card.delete({id: req.params.id})
        return res.json({card})
    }catch (e) {
        return res.status(500).json({message: e.message})
    }
}

const getCountToReview = async (req, res) => {
    try{
        const user_id = req.user.userId
        const count = await Card.countToReview({user_id})
        return res.json({count})
    }catch (e) {
        return res.status(500).json({message: e.message})
    }
}

module.exports = {
    getCards,
    createCard,
    deleteCard,
    getCountToReview
}