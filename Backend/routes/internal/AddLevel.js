const express = require('express')
const database = require('../../utils/database')
const router = express.Router()
router.use(express.json())

router.post("/", (request, response) => {
    const sql = `INSERT INTO cfs_job_level(level_name) VALUES(?)`
    database.query(sql, [request.body.levelname], (error, result) => {
        if (error) {
            response.json({ "message": error.message }).status(500)
        } else {
            response.json({ "message": "Success" }).status(200)
        }
    })
})

module.exports = router