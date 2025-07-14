const express = require("express");
const { esclateTicket } = require("../../utils/operationmethods");
const {
  getCategoryTime,
  getTicketByid,
  setNextDeadLine,
} = require("../helpers/databaseHelpers");
const router = express.Router();
router.use(express.json());

router.post("/", async (request, response) => {
  const tkt_id = request.body.tkt_id;
  esclateTicket(
    tkt_id,
    request.session.userOffice,
    request.session.hierarchy,
    request.session.emp_id
  )
    .then((result) => {
      if (result) {
        getTicketByid(tkt_id)
          .then((result) => {
            getCategoryTime(result[10])
              .then((result) => {
                setNextDeadLine(tkt_id, result);
                response.status(200).json({ message: "successful" });
              })
              .catch((error) => {
                response.status(500).json({ message: "failed" });
              });
          })
          .catch((error) => {
            response.status(500).json({ message: "failed" });
          });
      } else if (result === false) {
        response.status(500).json({ message: "failed" });
      } else {
        response.status(500).json({ message: "failed" });
      }
    })
    .catch((error) => {
      response.status(500).json({ message: "failed" });
    });
});

module.exports = router;
