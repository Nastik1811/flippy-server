const Card = require('../models/Card')

const createCard = async (req, res) => {
    try{
        const {user_id, collection_id, front, back}  = req.body
        const card = new Card({user_id, collection_id, front, back}) .save()
        console.log(card)

        return res.status(201).json({message: "Success!"})
    }catch (e) {
        return res.status(500).json({message: 'Something went wrong... Please, try again.'})
    }

}


module.exports = {
}