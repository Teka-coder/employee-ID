const express = require("express");
const { editAccount } = require("../../../api/helpers/databaseHelpers");
const router = express.Router();
router.use(express.json());

router.post("/", (request, response) => {
  const empId = request.body.id;
  const empFirstName = request.body.empFirstName;
  const empMiddleName = request.body.empMiddleName;
  const empLastName = request.body.empLastName;
  const empPhoneNumber = request.body.empPhoneNumber;
  const empEmail = request.body.empEmail;
  const empHierarchy = request.body.empHierarchy;
  const empTitle = request.body.empTitle;
  const empLevel = request.body.empLevel;
  const empOffice = request.body.empOffice;
  editAccount(
    empId,
    empFirstName,
    empMiddleName,
    empLastName,
    empPhoneNumber,
    empEmail,
    empHierarchy,
    empTitle,
    empLevel,
    empOffice
  )
    .then((result) => {
      if (result) {
        response.status(200).json({ message: "successfull" });
      } else {
        response.status(500).json({ message: "failed" });
      }
    })
    .catch((error) => {
      console.log(error)
      response.status(500).json({ message: "failed" });
    });
});

module.exports = router;
