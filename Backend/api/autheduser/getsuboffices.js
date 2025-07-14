const express = require('express')
const { getChildOffices,getMineOffice } = require('../helpers/databaseHelpers')
const router = express.Router()

router.get('/', (request,response)=>{
    getChildOffices(request.session.userOffice).then(result => {
        if(result === false){
            response.status(500).json({"message":"error"})
        }else{
            response.status(200).json(result)
        }
    }).catch(error => {
        response.status(500).json({"message":"error"})
    })


    // if(request.session.hierarchy=='high'){
    //     getChildOffices(request.session.userOffice).then(result => {
    //         if(result === false){
    //             response.status(500).json({"message":"error"})
    //         }else{
    //             response.status(200).json(result)
    //         }
    //     }).catch(error => {
    //         response.status(500).json({"message":"error"})
    //     })
    // }else{
    //     getMineOffice(request.session.emp_id).then(result => {
    //         if(result === false){
    //             response.status(500).json({"message":"error"})
    //         }else{
    //             response.status(200).json(result)
    //         }
    //     }).catch(error => {
    //         response.status(500).json({"message":"error"})
    //     })
    // }




   
})

module.exports = router