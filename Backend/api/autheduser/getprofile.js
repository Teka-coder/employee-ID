const express = require('express')
const { getMyProfile } = require('../helpers/databaseHelpers')
const router = express.Router()

router.get('/', (request,response)=>{
    getMyProfile(request.session.emp_id).then(result => {
        if(result === false){
            response.status(500).json({"message":"error"})
        }else{
            response.status(200).json(result[0])
        }
    }).catch(error => {
        response.status(500).json({"message":"error"})
    })
})

module.exports = router