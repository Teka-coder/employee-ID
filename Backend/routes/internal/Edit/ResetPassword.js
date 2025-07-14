const express = require('express')
const {resetPassword } = require('../../../api/helpers/databaseHelpers')
const router = express.Router()

router.post('/', (request, response)=>{
    const id = request.body.id
    resetPassword(id).then(result => {
        if(result){
            response.status(200).json({"message":"successful"})
        }else{
            response.status(500).json({"message":"failed"})
        }
    }).catch(error => response.status(500).json({"message":"failed"}))
})

module.exports = router