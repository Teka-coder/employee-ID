const express = require('express')
const { getCategories } = require('../../utils/operationmethods')
const router = express.Router()

router.get('/',(request, response)=>{
    getCategories().then(result => {
        if(result){
            response.status(200).json(result)
        }else{
            response.status(500).json({"message":"Error Occured"})
        }
    }).catch(error => {
        response.status(500).json({"message":"Error Occured"})
    })
})

module.exports = router