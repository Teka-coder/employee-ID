const express = require('express')
const database = require('../../utils/database')
const { getLevelName, getTitleName, getOfficeName } = require('../helpers/databaseHelpers')
const router = express.Router()
router.use(express.json())

router.get('/', (request, response) => {
    const sql = 'SELECT * FROM cfs_employee'
    database.query(sql, async (error, result) => {
        if (error) {
            response.status(500).send('<p>Server Error</p>')
        } else {
            const dataPromises = result.map(async (row) => {
                const title = await getTitleName(row.emp_job_title)
                const level = await getLevelName(row.emp_job_level)
                const office = await getOfficeName(row.emp_job_office)
                return [row.emp_id, row.emp_firstname, row.emp_middlename, row.emp_lastname, row.emp_phonenumber, row.emp_email, title, level, office, row.emp_job_title, row.emp_job_level, row.emp_job_office,row.hierarchy]
            })
            const data = await Promise.all(dataPromises)
            response.json(data).status(200)
        }
    })
})

module.exports = router