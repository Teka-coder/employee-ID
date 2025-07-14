const express = require("express");
const database = require("../../utils/database");
const { getCategoryName } = require("../../utils/operationmethods");
const { getMyChildOfficetickets } = require("../helpers/databaseHelpers");
const router = express.Router();
router.use(express.json());

router.post('/', (request,response)=>{
    getMyChildOfficetickets(request.body.id).then(result =>{
        if(result !== false){
            response.status(200).json(result)
        }else{
            response.status(500).json({"error":"failed"})
        }
    }).catch(error =>{
        response.status(500).json({"error":"failed"})
    })
})

module.exports = router