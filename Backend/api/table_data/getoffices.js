const express = require('express')
const database = require('../../utils/database')
const { getOfficeName, getBranchName, getEmployeeFullName } = require('../helpers/databaseHelpers')
const router = express.Router()

router.get('/', (request, response) => {
    const sql = 'SELECT * FROM cfs_offices'
    database.query(sql, async (error, result) => {
        if (error) {
            response.status(500).send('<p>Internal Server Error</p>')
        } else {
            const dataPromises = result.map(async row => {
                const officeName = await getOfficeName(row.office_parent);
                const branchName = await getBranchName(row.office_branch);
                return [row.office_id, row.office_name, officeName, branchName];
            })
            const data = await Promise.all(dataPromises);
            response.json(data).status(200)
        }
    })
})

module.exports = router