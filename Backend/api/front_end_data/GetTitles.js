const express = require('express')
const database = require('../../utils/database')
const router = express.Router()
router.use(express.json())

router.get('/', (request, response) => {
    const sql = 'SELECT title_id,title_name FROM cfs_job_title'
    database.query(sql, (error, result) => {
        if (error) {
            response.status(500).send(error)
        } else {
            const data = result.map(data => [data.title_id, data.title_name])
            response.status(200).json(data)
            return
        }
    })
})

module.exports = router