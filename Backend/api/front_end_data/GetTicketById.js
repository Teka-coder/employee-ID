const express = require('express')
const database = require('../../utils/database')
const { getTicketByid } = require('../helpers/databaseHelpers')
const router = express.Router()
router.use(express.json())


router.get('/:id', (request, response) => {
    const id = request.params.id
    getTicketByid(id).then(result => {
        if(result !== false){
            response.status(200).json(result)
        }else{
            response.status(500).json({"message":"error"})
        }
    }).catch(error => {
        response.status(500).json({"message":"error"})
    })
})

module.exports = router