const express = require("express");
const {
  updateRequestStatus,
  insertClosedTime,
  decreaseAssignedRequestAmount,
} = require("../../utils/operationmethods");
const router = express.Router();
router.use(express.json());

router.post("/", (request, response) => {
  const id = request.body.id;
  updateRequestStatus(id, "Resolved")
    .then((result) => {
      if (result) {
        insertClosedTime(id).then((result) => {
          if (result) {
            decreaseAssignedRequestAmount(request.session.emp_id)
            response.status(200).json({ message: "success" });
          } else {
            response.status(500).json({ message: "failed" });
          }
        });
      } else {
        response.status(500).json({ message: "failed" });
      }
    })
    .catch((error) => {
      response.status(500).json({ message: "failed" });
    });
});

module.exports = router;
