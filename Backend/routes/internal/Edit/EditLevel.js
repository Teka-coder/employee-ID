const express = require('express')
const { updateLevel } = require('../../../api/helpers/databaseHelpers')
const router = express.Router()
router.use(express.json())

router.post('/', (request, response)=>{
    const id = request.body.id
    const level = request.body.levelName
    updateLevel(id, level).then(result => {
        if(result){
            response.status(200).json({"message":"successfull"})
        }else{
            response.status(500).json({"message":"failed"})
        }
    }).catch(error => response.status(500).json({"message":"failed"}))
})

module.exports = router