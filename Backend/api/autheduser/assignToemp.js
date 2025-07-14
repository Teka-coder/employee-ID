const express = require("express");
const {
  getTicketByid,
  getCategoryTime,
  setNextDeadLine,
} = require("../helpers/databaseHelpers");
const { assignTicketTo, increaseAssignedRequestAmount, decreaseAssignedRequestAmount, updateRequestStatus } = require("../../utils/operationmethods");
const router = express.Router();
router.use(express.json());

router.post("/", (request, response) => {
  const emp_id = request.body.emp_id;
  const tkt_id = request.body.tkt_id;
  const splitted_id = tkt_id.split("_")[3];
  getTicketByid(splitted_id).then((result) => {
    const office_id = result[11];
    const prev_owner = result[7];
    getCategoryTime(result[14]).then((result) => {
        const time = result
        assignTicketTo(splitted_id, office_id, emp_id).then(result => {
            if(result === true){
                increaseAssignedRequestAmount(emp_id);
                decreaseAssignedRequestAmount(prev_owner);
                setNextDeadLine(splitted_id,time);
                updateRequestStatus(splitted_id, 'InProgress');
            }else{
                response.status(500).json({'message':'failed'})
            }
        })
    });
  }).catch(error => {
    response.status(500).json({'message': error})
  });
});

module.exports = router;
