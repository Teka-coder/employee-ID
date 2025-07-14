const express = require("express");
const database = require("../../utils/database");
const {
  encryptPassword,
  comparePassword,
} = require("../../utils/operationmethods");
const { setOnline } = require("../../api/helpers/databaseHelpers");
const router = express.Router();
const jwt = require('jsonwebtoken');
router.use(express.json());


const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
};
router.post("/", (request, response) => {
  const useremail = request.body.email;
  const userpassword = request.body.password;
  const userstatus = 1;

  console.log("Received email:", useremail);
  //console.log("Received password:", userpassword);

  if (!useremail || !userpassword) {
    console.error("Email or password not provided in request body");
    return response.status(400).json({ status: false, message: "Email and password are required" });
  }

  const sql = `SELECT *
FROM user
LEFT JOIN cfs_feedback ON cfs_feedback.user = user.user_id
WHERE user.cfs_useremail = ?
AND user.user_status = ?
`;

// SELECT *
// FROM user
// LEFT JOIN cfs_feedback ON cfs_feedback.user = user.user_id
// WHERE user.cfs_useremail = ?
// AND user.user_status = ?

 // console.log("Executing SQL query:", sql);
//  console.log("With parameters:", [useremail, userstatus]);

  database.query(sql, [useremail, userstatus], async (error, result) => {
    if (error) {
      console.error("Database query error check if db server is running:", error);
      return response.status(500).json({ status: false, message: "Internal server error" });
    }

    if (result.length === 0) {
      console.log("No user found with provided email and status");
      // here the inner join might affect the result to be not found, some edition needed for if user have no foreign key for feedback
      return response.status(401).json({ status: false, message: "Invalid email or status" });
    }

    const storedPassword = result[0].cfs_password;
    console.log("Password from database:", storedPassword);

    const areEqual = await comparePassword(userpassword, storedPassword);
    console.log("Password comparison result:", areEqual);

    if (areEqual) {
      request.session.logged = true;
      request.session.userid = result[0].user_id;
      request.session.verified = result[0].mlm_verified;
      request.session.fullName = `${result[0].first_name} ${result[0].middle_name}`;
      request.session.usertype = result[0].cfs_user_type;
      request.session.linkatempt = result[0].link_attempt;
      // request.session.firstTime = result[0].firstlogin;
      const user = {
        id: result[0].user_id,
        email: result[0].cfs_useremail,
      };

      const token = generateAccessToken(user);
      setOnline(result[0].user_id);

      // console.log("User authenticated successfully:", request.session);
      // return response.status(200).json({ status: true });
      console.log("User authenticated successfully:", user);
      return response.status(200).json({ status: true, token });
    } else {
      console.log("Incorrect password");
      return response.status(401).json({ status: false, message: "Incorrect password" });
    }
  });
});

module.exports = router;
