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

const deleteCard = async (req, res) => {
    try{
        const card = await Card.delete({id: req.params.id})
        return res.json({card})
    }catch (e) {
        return res.status(500).json({message: e.message})
    }
}

const getCards= async (req, res) => {
    let collection_id = req.query.collection_id
    let needReview = false
    if(req.query.needReview){
        needReview = JSON.parse(req.query.needReview)
    }

    try{
        const user_id = req.user.userId
        const cards = await Card.getCards({user_id, needReview, collection_id})
        return res.json({cards})
    }catch (e) {
        return res.status(500).json({message: e.message})
    }
}

module.exports = {
    getCards,
    createCard,
    deleteCard
}