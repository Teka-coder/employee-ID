const express = require("express");
const database = require("../../utils/database");
const {
  assignTicketToOffice,
  decreaseAssignedRequestAmount,
  assignTicketTo,
  updateRequestStatus,
} = require("../../utils/operationmethods");
const {
  getTicketByid,
  getCategoryTime,
  setNextDeadLine,
} = require("../helpers/databaseHelpers");
const router = express.Router();
router.use(express.json());

router.post("/", async (request, response) => {
  const result = await assignTicketToOffice(
    request.body.tkt_id,
    request.body.office_id
  );
  if (result) {
    getTicketByid(request.body.tkt_id)
      .then((result) => {
        getCategoryTime(result[14])
          .then((result) => {
            setNextDeadLine(request.body.tkt_id, result);
            updateRequestStatus(request.body.tkt_id, "InProgress")
          })
          .catch((error) => console.error());
      })
      .catch((error) => console.error(error));
    if (request.body.emp_id !== null) {
      decreaseAssignedRequestAmount(request.body.emp_id);
    }
    response.status(200).json({ message: "successfull" });
  } else {
    response.status(500).json({ message: "failed" });
  }
});

module.exports = router;
