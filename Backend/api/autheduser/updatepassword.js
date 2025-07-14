const express = require("express");
const { updatePassword } = require("../helpers/databaseHelpers");
const router = express.Router();
router.use(express.json());

router.post("/", (request, response) => {
  updatePassword(request.session.emp_id, request.body.password)
    .then((result) => {
      if (result) {
        response.status(200).json({ message: "successfull" });
      } else {
        response.status(500).json({ message: "failed" });
      }
    })
    .catch((error) => {
      response.status(500).json({ message: "failed" });
    });
});

module.exports = router;
