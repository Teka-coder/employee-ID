const express = require("express");
const { insertMessageManagment } = require("../../utils/operationmethods");
const router = express.Router();
router.use(express.json());

router.post("/", (request, response) => {
  insertMessageManagment(
    request.body.requestId,
    1,
    request.session.emp_id,
    request.body.message,
    request.session.userOffice
  )
    .then((result) => {
      if (result) {
        response.status(200).json({ message: "success" });
      } else {
        response.status(500).json({ message: "failed" });
      }
    })
    .catch((error) => {
      response.status(500).json({ message: "failed" });
    });
});

module.exports = router;
