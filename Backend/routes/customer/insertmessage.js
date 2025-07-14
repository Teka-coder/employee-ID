const express = require("express");
const {
  insertMessage,
  updateRequestStatus,
} = require("../../utils/operationmethods");
const { setNewMessageTrue } = require("../../api/helpers/databaseHelpers");
const router = express.Router();
router.use(express.json());

router.post("/", (request, response) => {
  const wholeId = request.body.requestId.split("_");
  const id = wholeId[wholeId.length - 1];
  insertMessage(id, 0, request.body.message)
    .then((result) => {
      if (result) {
        setNewMessageTrue(id);
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
