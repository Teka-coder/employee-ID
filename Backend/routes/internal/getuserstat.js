const express = require("express");
const session = require("express-session");
const router = express.Router();

router.get("/", (request, response) => {
  if (request.session.logged === undefined) {
    response.status(401).send("<h1>Unauthorized</h1>");
  } else {
    const data = {
      logged: request.session.logged,
      acc_id: request.session.id,
      role: request.session.role,
      acc_status: request.session.acc_status,
      randid: request.session.acc_randid,
      fullName: request.session.fullName,
    };
    response.status(200).json(data);
  }
});

module.exports = router;
