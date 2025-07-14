const express = require('express')
const database = require('../../utils/database')
const router = express.Router()

router.use(express.json())
router.post('/', (request, response) => {
    const sql = "INSERT INTO cfs_branches(branch_name) VALUES (?)"
    database.query(sql, [request.body.branchName], (error, result) => {
        if (error) {
            response.json({ "message": error }).status(500)
        } else {
            response.json({ "message": "successful" }).status(200)
        }
    })
})
module.exports = router