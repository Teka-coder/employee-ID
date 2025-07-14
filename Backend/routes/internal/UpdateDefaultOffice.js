const express = require('express')
const database = require('../../utils/database')
const router = express.Router()
router.use(express.json())

router.post('/', (request, response) => {
    const id = request.body.office_id
    const sql = "UPDATE cfs_default_office SET office_id = ?"
    database.query(sql, [id], (error, result) => {
        if (error) {
            response.json({ "error": error }).status(500)
        } else {
            response.json({ "message": "successful" }).status(200)
        }
    })
})

module.exports = router