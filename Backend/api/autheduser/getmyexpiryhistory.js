const express = require('express')
const { getMyExpiryHistory } = require('../helpers/databaseHelpers')
const router = express.Router()
router.use(express.json())

router.post('/',(request,response)=>{
    getMyExpiryHistory(request.body.id).then(result => {
        response.status(200).json(result)
    }).catch(error =>{
        response.status(500).json({"message":"failed"})
    })
})

module.exports = router