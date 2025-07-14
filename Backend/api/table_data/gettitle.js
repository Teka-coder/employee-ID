const express = require('express')
const database = require('../../utils/database')
const { getTitleName } = require('../helpers/databaseHelpers')
const router = express.Router()
router.use(express.json())

router.get('/', (request, response) => {
    const sql = 'SELECT * FROM cfs_job_title'
    database.query(sql, async (error, result) => {
        if (error) {
            response.status(500).json({ "message": error })
        } else {
            const dataPromise = result.map(row => {
                return getTitleName(row.title_parent).then(res => {
                    return [row.title_id, row.title_name, res, row.title_parent]
                })
            })
            const data = await Promise.all(dataPromise)
            response.json(data).status(200)
        }
    })
})

module.exports = router