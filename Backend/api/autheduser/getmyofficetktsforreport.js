const exress = require('express')
const { getMyHighOfficeTicketsForReport,getMyMidOfficeTicketsForReport,getMyLowOfficeTicketsForReport } = require('../helpers/databaseHelpers')
const router = exress.Router()

router.get('/', (request, response)=>{
if(request.session.hierarchy=='high'){

    getMyHighOfficeTicketsForReport(request.session.userOffice).then(result => {
        response.status(200).json(result)
    }).catch(error => {
        response.status(500).json({"message":"error occured"})
    })
}else if(request.session.hierarchy=='mid'){

    getMyMidOfficeTicketsForReport(request.session.userOffice).then(result => {
        response.status(200).json(result)
    }).catch(error => {
        response.status(500).json({"message":"error occured"})
    })
} else if(request.session.hierarchy=='low'){

    getMyLowOfficeTicketsForReport(request.session.emp_id).then(result => {
        response.status(200).json(result)
    }).catch(error => {
        response.status(500).json({"message":"error occured"})
    })
}else{}


})

module.exports = router