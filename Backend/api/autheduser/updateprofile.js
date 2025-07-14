const express = require("express");
const { updateProfile } = require("../helpers/databaseHelpers");
const router = express.Router();
router.use(express.json());

router.post("/", (request, response) => {
    updateProfile(request.session.emp_id, request.body.fname,request.body.lname,request.body.phone)
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
