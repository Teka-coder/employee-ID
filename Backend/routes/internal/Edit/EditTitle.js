const express = require('express')
const { editTitle } = require('../../../api/helpers/databaseHelpers')
const router = express.Router()

router.post('/', (request, response)=>{
    const id = request.body.id
    const name = request.body.titleName
    const parent = request.body.parent
    editTitle(id, name, parent).then(result => {
        if(result){
            response.status(200).json({"message":"successful"})
        }else{
            response.status(500).json({"message":"failed"})
        }
    }).catch(error => response.status(500).json({"message":"failed"}))
})

module.exports = router