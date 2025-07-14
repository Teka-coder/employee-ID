const express = require("express");
const { getOfficeEmployees } = require("../helpers/databaseHelpers");
const router = express.Router();
router.use(express.json());

router.get("/", (request, response) => {
  getOfficeEmployees(request.session.userOffice)
    .then((result) => {
      response.status(200).json({ data: result });
    })
    .catch((error) => {
      response.status(500).json({ message: error });
    });
});
module.exports = router;
