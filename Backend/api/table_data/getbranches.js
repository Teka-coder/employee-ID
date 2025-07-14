const express = require('express')
const database = require('../../utils/database')
const { getEmployeeFullName } = require('../helpers/databaseHelpers')
const router = express.Router()
router.use(express.json())

router.get('/', async (request, response) => {
    const sql = "SELECT branch_id, branch_name FROM cfs_branches"
    database.query(sql, async (error, result) => {
        if (error) {
            response.json(500).send("<p>Internal Server Error</p>")
        } else {
            const data = result.map(row => [row.branch_id, row.branch_name])
            response.json(data).status(200)
        }
    })
})


module.exports = router