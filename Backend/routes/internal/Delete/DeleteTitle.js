const express = require('express')
const { deleteTitle } = require('../../../api/helpers/databaseHelpers')
const router = express.Router()

router.post('/', (request, response)=>{
    deleteTitle(request.body.id).then(result => {
        if(result){
            response.status(200).json({"message":"error"})
        }else{
            response.status(500).json({"message":"error"})
        }
    }).catch(error => response.status(500).json({"message":"error"}))
})
module.exports = router