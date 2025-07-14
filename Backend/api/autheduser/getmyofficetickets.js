const exress = require('express')
const { getOfficetickets } = require('../helpers/databaseHelpers')
const router = exress.Router()

router.get('/', (request, response)=>{
    getOfficetickets(request.session.userOffice).then(result => {
        response.status(200).json(result)
    }).catch(error => {
        response.status(500).json({"message":"error occured"})
    })
})

module.exports = router