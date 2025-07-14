const express = require("express");
const { deleteOffice } = require("../../../api/helpers/databaseHelpers");
const router = express.Router();

router.post("/", (request, response) => {
  deleteOffice(request.body.id)
    .then((result) => {
      if (result) {
        response.status(200).json({ message: "successfull" });
      } else {
        response.status(500).json({ message: "failed" });
      }
    })
    .catch((error) => response.status(500).json({ message: "failed" }));
});

module.exports = router;
