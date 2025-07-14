const express = require('express')
const database = require('../../utils/database')
const router = express.Router()
router.use(express.json())

router.post("/", (request, response) => {
    const sql = `INSERT INTO cfs_offices(office_name, office_parent, office_branch) VALUES(?,?,?)`
    database.query(sql, [request.body.officeName, request.body.officeParent, request.body.officeBranch], (error, result) => {
        if (error) {
            response.json({ "message": error.message }).status(500)
            console.log(error)
        } else {
            response.json({ "message": "Success" }).status(200)
        }
    })
})

module.exports = router