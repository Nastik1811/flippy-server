const Card = require('../models/Card')

//getCards
//createCard
//getCardById
//getCardsGroupByCollection ???
//getCardsNeedRepetition
//


const createCard = async (req, res) => {
    try{
        const {collection_id, front, back}  = req.body
        const {user_id} = req.user.userId

        const card = new Card({user_id, collection_id, front, back})
        await card.save()

        console.log(card)

        return res.status(201).json({message: "Success!"})
    }catch (e) {
        return res.status(500).json({message: 'Something went wrong... Please, try again.'})
    }
}

const getCards = async (req, res) => {
    try{
        const user_id = req.user.userId
        const cards = await Card.find({user_id})
        return res.status(201).json({message: "Success!", cards})
    }catch (e) {
        return res.status(500).json({message: e.message})
    }
}


module.exports = {
    getCards,
    createCard
}