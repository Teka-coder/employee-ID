const express = require("express");
const { getMyExpiredTickets } = require("../helpers/databaseHelpers");
const router = express.Router();
router.use(express.json());

router.get("/", (request, response) => {
  if (request.session.emp_id) {
    getMyExpiredTickets(request.session.emp_id)
      .then((result) => {
        if (result) {
          response.status(200).json(result);
        } else {
          response.status(501).json({ message: "failed" });
        }
      })
      .catch((error) => response.status(501).json({ message: "failed" }));
  } else {
    response.status(501).json({ message: "failed" });
  }
});

module.exports = router;
