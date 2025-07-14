const express = require('express')
const database = require('../../utils/database')
const router = express.Router()
router.use(express.json())

router.get('/', (request, response) => {
    const sql = "SELECT branch_id, branch_name FROM cfs_branches"
    database.query(sql,(error, result) => {
        if(error){
            response.status(500).send(error)
            return
        }else{
            const data = result.map(data => [data.branch_id, data.branch_name])
            response.status(200).json(data)
            return
        }
    })
})

module.exports = router