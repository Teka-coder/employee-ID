const exress = require('express')
const { getMyChildOfficeTicketsForReport} = require('../helpers/databaseHelpers')
const router = exress.Router()
router.get('/', (request, response)=>{
    if(request.session.hierarchy=='high'){
    
        getMyChildOfficeTicketsForReport(request.session.userOffice).then(result => {
            response.status(200).json(result)
        }).catch(error => {
            response.status(500).json({"message":"error occured"})
        })
    }
    
})

module.exports = router