const express = require('express');
const { updateOffice } = require('../../../api/helpers/databaseHelpers');
const router = express.Router();
router.use(express.json())

router.post('/', (request, response)=>{
    const id = request.body.id
    const officeName = request.body.officeName
    const officeParent = request.body.officeParent
    const officeBranch = request.body.officeBranch
    updateOffice(id, officeName, officeParent, officeBranch).then(result => {
        if(result){
            response.status(200).json({"message":"successful"})
        }else{
            response.status(500).json({"message":"failed"})
        }
    }).catch(error => response.status(500).json({"message":"failed"}))
})

module.exports = router;
