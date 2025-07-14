const exress = require('express')
const { analysMyLowOfficetickets,analysMyMidOfficetickets,analysMyHighOfficetickets } = require('../helpers/databaseHelpers')
const router = exress.Router()

router.get('/', (request, response)=>{
    if(request.session.hierarchy=='high'){
        analysMyHighOfficetickets(request.session.userOffice).then(result => {
            //console.log("result" +result)
            response.status(200).json(result)
        }).catch(error => {
            response.status(500).json({"message":"error occured"})
        })    
    }
   else if(request.session.hierarchy=='mid'){
    analysMyMidOfficetickets(request.session.userOffice).then(result => {
        //console.log("result" +result)
        response.status(200).json(result)
    }).catch(error => {
        response.status(500).json({"message":"error occured"})
    })
   }else if(request.session.hierarchy=='low'){
    
analysMyLowOfficetickets(request.session.emp_id).then(result => {
    //console.log("result" +result)
    response.status(200).json(result)
}).catch(error => {
    response.status(500).json({"message":"error occured"})
})
   }else{}
})


module.exports = router