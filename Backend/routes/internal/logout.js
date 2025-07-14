const express = require("express");
const { setUserOffline } = require("../../api/helpers/databaseHelpers");
const router = express.Router();

router.get("/", (request, response) => {
  setUserOffline(request.session.acc_id).then((result) => {
    request.session.destroy();
    response.status(200).json({ status: "logged out" });
  });
});

module.exports = router;
