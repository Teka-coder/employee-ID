const express = require("express");
const { deactivateUser } = require("../../../api/helpers/databaseHelpers");
const router = express.Router();
router.use(express.json());

router.post("/", (request, response) => {
  deactivateUser(request.body.id)
    .then((result) => {
      if (result) {
        response.status(200).json({ message: "successfull" });
      } else {
        response.status(500).json({ message: "failed" });
      }
    })
    .catch((error) => response.status(500).json({ message: "error" }));
});
module.exports = router;
