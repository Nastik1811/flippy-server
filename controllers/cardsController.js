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
        return res.json({id: card.id})
    }catch (e) {
        return res.status(500).json({message: e.message})
    }
}

const deleteCardsCollection = async (req, res) => {
    try{
        let collectionId = req.query.collectionId
        if(!collectionId){
            return res.status(500).json({message: "Collection is undefined"})
        }
        const cards = await Card.deleteCardsCollection({collection_id: collectionId})
        return res.json({ids: cards.map(c => c.id)})
    }catch (e) {
        return res.status(500).json({message: e.message})
    }
}

const getCards= async (req, res) => {
    let collectionId = req.query.collectionId
    let needReview = false
    if(req.query.needReview){
        needReview = JSON.parse(req.query.needReview)
    }
    try{
        const user_id = req.user.userId
        const cards = await Card.getCards({user_id, needReview, collection_id: collectionId})
        return res.json({cards})
    }catch (e) {
        return res.status(500).json({message: e.message})
    }
}

const getCard = async (req, res) => {
    try{
        const card = await Card.findOne({id: req.params.id})
        return res.json({card})
    }catch (e) {
        return res.status(500).json({message: e.message})
    }
}

const updateCard = async (req, res) => {
    try {
        const {front, back} = req.body
        const collection_id = req.body.collection_id ? req.body.collection_id : null
        //const collection_id = JSON.parse(req.body.collection_id)
        //console.log(collection_id, typeof collection_id)
        const card = await Card.updateCardDetails({id: req.params.id, collection_id, front, back})
        return res.status(200).json({card})

    }catch (e) {
        return res.status(500).json({message: e.message})
    }
}
const updateCardProgress = async (req, res) => {
    try {
        const {card, mark} = req.body
        const currentDateTime = new Date()
        const lastReview = new Date(card.last_review)
        const scheduledReview = new Date(card.scheduled_review)

        const updatedCard = await Card.updateCardProgress({
            id: card.id,
            currentDateTime,
            nextReviewDate: getNextReviewDate({scheduledReview, lastReview, currentDateTime, status: card.status, mark}),
            newStatus: getNewStatus({status: card.status, mark})
        })
        return res.status(200)

    }catch (e) {
        return res.status(500).json({message: e.message})
    }
}

const MINUTE = 60000

const getNewStatus = ({status, mark}) => {
    if(status === 'new'){
        return 'learning'
    }
    if (status === 'learning' && mark === 'excellent'){
        return 'review'
    }
    return undefined
}
const getNextReviewDate = ({scheduledReview, lastReview, currentDateTime, status, mark}) => {
    let newIntervalInMilliseconds

    switch (status) {
        case 'new':
            newIntervalInMilliseconds = 10 * MINUTE
            break
        case 'learning':
            if(mark === 'bad'){
                newIntervalInMilliseconds = 10 * MINUTE
            }else if(mark === 'good'){
                newIntervalInMilliseconds = 60 * MINUTE
            }else {
                newIntervalInMilliseconds = 24 * 60 * MINUTE
            }
            break
        case 'review':
            newIntervalInMilliseconds = calculateInterval({lastReview, scheduledReview, currentDateTime, mark})
            break
        default:
            throw new Error("Invalid card status")
    }
    return new Date(Date.now() + newIntervalInMilliseconds)
}

const calculateInterval = ({lastReview, scheduledReview, currentDateTime, mark}) => {
    let recommendedInterval= scheduledReview.getTime() - lastReview.getTime()
    let delay = currentDateTime.getTime() - scheduledReview.getTime()

    let newInterval

    switch(mark){
        case 'bad':
            newInterval = recommendedInterval + delay/4
            break
        case 'good':
            newInterval = (recommendedInterval + delay/2 ) * 1.5
            break
        case 'excellent':
            newInterval = (recommendedInterval + delay) * 2
            break
        default:
            throw Error
    }

    return newInterval
}


module.exports = {
    getCards,
    getCard,
    createCard,
    deleteCard,
    deleteCardsCollection,
    updateCardProgress,
    updateCard
}