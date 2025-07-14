const express = require('express')
const database = require('../../utils/database')
const router = express.Router()

router.get("/", (request, response) => {
    const sql = 'SELECT office_id, office_name,office_parent, office_branch FROM cfs_offices'
    database.query(sql, (error, result) => {
        if (error) {
            response.status(500).json({ "message": error })
        } else {
            const data = result.map(data => [data.office_id, data.office_name, data.office_parent, data.office_branch])
            response.status(200).json(data)
        }
    })
})

module.exports = router