const express = require("express");
const { getTicketByTrackingId } = require("../../utils/operationmethods");
const router = express.Router();

router.use(express.json());

router.post("/", (request, response) => {
  const tkt_id = request.body.tktid;
  getTicketByTrackingId(tkt_id)
    .then((result) => {
      if (result.length === 0) {
        response.status(500).json({ message: "empty" });
      } else {
        response.status(200).json(result)
      }
    })
    .catch((error) => {
      response.status(500).json({message: "empty"})
    });
});

module.exports = router;
