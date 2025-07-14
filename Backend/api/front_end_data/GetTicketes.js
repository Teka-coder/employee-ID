const express = require('express')
const database = require('../../utils/database')
const { getAllTickets } = require('../helpers/databaseHelpers')
const router = express.Router()
router.use(express.json())

router.get('/', (request, response) => {
    getAllTickets().then(result => {
        response.status(200).json(result)
    })
})

module.exports = router