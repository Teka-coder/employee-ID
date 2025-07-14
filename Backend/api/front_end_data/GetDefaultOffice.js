const express = require('express')
const database = require('../../utils/database')
const { getOfficeName } = require('../helpers/databaseHelpers')
const router = express.Router()

router.get('/', (request, response) => {
    const sql = 'SELECT office_id FROM cfs_default_office WHERE id = 2'
    database.query(sql, (error, result) => {
        if (error) {
            response.status(500).json({ "message": error })
        } else {
            try{
                getOfficeName(result[0].office_id).then(data => {
                response.status(200).json(data)
            }).catch(error => console.log(error))
            }catch(error){
                console.log(error)
            }      
        }
    })
})

module.exports = router