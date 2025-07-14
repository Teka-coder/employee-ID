const express = require("express");
const database = require("../../utils/database");
const {
  comparePassword,
} = require("../../utils/operationmethods");
const { setUserOnline } = require("../../api/helpers/databaseHelpers");
const router = express.Router();

router.use(express.json());

router.post("/", (request, response) => {
  const accstatus='active';
  const user = request.body.username;
  const password = request.body.password;
  const sql = `SELECT * FROM account WHERE username = ? AND acc_status = ?`;
  database.query(sql,[user,accstatus] ,async (error, result) => {
    if (error) {
      console.log("error "+error)
      response.status(401).json({ status: false });
    } else if (result.length === 0) {
      console.log("result "+result.length)
      response.status(401).json({ status: false });
    } else {
      const storedPassword = result[0].password;
      const areEqual = await comparePassword(password, storedPassword);
      if (areEqual === true) {
        console.log("Password confirmed !")
        request.session.logged = true;
        request.session.acc_id = result[0].id;
        request.session.loggeduser = result[0].username;
        request.session.role = result[0].role;
        request.session.fullName = result[0].fullname;
        request.session.randid = result[0].acc_randid;
        request.session.acc_status = result[0].acc_status;
        console.log("logged in user "+request.session.loggeduser)
        setUserOnline(result[0].id)
        response.status(200).json({ status: true });
      } else {
        console.log("Password does not match! ❌");
        response.status(401).json({ status: false });
      }
    }
  });
});
module.exports = router;
