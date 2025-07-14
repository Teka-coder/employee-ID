const express = require('express')
const { getAttachedFiles } = require('../helpers/databaseHelpers')
const router = express.Router()

router.post('/', (request, response)=>{
    getAttachedFiles(request.body.id).then(result =>{
        if(result != false){
            response.status(200).json(result)
        }else{
            response.status(500).json({"message":"failed"})
        }
    })
})

module.exports = router