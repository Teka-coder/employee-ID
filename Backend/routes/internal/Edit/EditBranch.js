const express = require('express')
const { updateBranch } = require('../../../api/helpers/databaseHelpers')
const router = express.Router()
router.use(express.json())

router.post('/', (request, response)=>{
    const id = request.body.id
    const branchName = request.body.branchName
    updateBranch(id,branchName).then(result => {
        if(result){
            response.status(200).json({"message":"successfull"})
        }else{
            response.status(500).json({"message":"failed"})
        }
    }).catch(error =>  response.status(500).json({"message":"failed"}))
})

module.exports = router