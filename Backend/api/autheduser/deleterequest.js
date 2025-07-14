const express = require("express");
const database = require("../../utils/database");
const {
  abortRequest,
  decreaseAssignedRequestAmount,
} = require("../../utils/operationmethods");
const router = express.Router();
router.use(express.json());

router.post("/", async (request, response) => {
  try {
    const result = await abortRequest(request.body.id);
    if (result === true) {
      decreaseAssignedRequestAmount(request.session.emp_id);
      response.status(200).json({ message: "deleted successfully" });
    } else {
      response.status(500).json({ message: "error occured" });
    }
  } catch (error) {
    response.status(500).json({ message: "error occured" });
  }
});

module.exports = router;
