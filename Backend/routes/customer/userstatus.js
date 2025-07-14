const express = require("express");
const session = require("express-session");
const router = express.Router();

router.get("/", (request, response) => {
  if (request.session.logged === undefined || request.session.userid===undefined) {
    if(request.RecentUser!==request.session.userid){
      response.status(401).send("<h1>Unauthorized attempt to pro</h1>");  //need further check
    }
    response.status(401).send("<h1>Server says, Unauthorized attempt</h1>");
  } else {
    const data = {
      Logged: request.session.logged,
      Userid: request.session.userid,
      Usertype: request.session.usertype,
      Verified: request.session.verified,
      Fullname: request.session.fullName,
      Linkattempt: request.session.linkatempt,
    };
    response.status(200).json(data);
  }
});

module.exports = router;
