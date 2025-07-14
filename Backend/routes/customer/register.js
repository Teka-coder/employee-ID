const express = require("express");
const database = require("../../utils/database");
const { encryptPassword } = require("../../utils/operationmethods");
const jwt = require('jsonwebtoken');
const router = express.Router();
router.use(express.json());


const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
};
router.post("/", async (request, response) => {
  try {
    const res = request.body;

    if(res.userFirstName==='' || res.userEmail==='' || res.userPhone==='' || res.userLastName==='' || res.userPassword==='') {
      console.log("trying to post empty data while registering"+res.userFirstName+" "+res.userEmail+" "+res.userPassword+" "+res.userPhone+" "+res.userLastName)
      return response.status(500).json({ message: "There are some empty data" });
    }



    const encryptedPassword = await encryptPassword(res.userPassword);
    
    const sql =
      "INSERT INTO user(cfs_useremail, cfs_password, created_by, updated_by,cfs_firstname,cfs_lastname,cfs_userphone) VALUES (?, ?, ?, ?,?,?,?)";
    
    database.query(sql, [res.userEmail, encryptedPassword, res.userEmail, res.userEmail,res.userFirstName,res.userLastName,res.userPhone], (error, result) => {
      if (error) {
        return response.status(500).json({ message: error+" Near query" });
      } 

      const insertedUserId = result.insertId;

      // Update user online status
      const updateSql = "UPDATE user SET online = 1 WHERE user_id = ?";
      database.query(updateSql, [insertedUserId], (updateError, updateResult) => {
        if (updateError) {
          return response.status(500).json({ message: updateError });
        } 

        // Generate JWT token
        const user = { id: insertedUserId,
                      email: res.userEmail
           };
        const accessToken = generateAccessToken(user);
        request.session.logged = true;
        request.session.userid = insertedUserId;

        response.status(200).json({ RecentUser: insertedUserId, message: 'User registered successfully', accessToken: accessToken,status: true });
       // console.log(insertedUserId + " Registered successfully", request.session);
        console.log(insertedUserId + " Registered successfully");
      });
    });
  } catch (err) {
    response.status(500).json({ message: err.message });
  }
});

module.exports = router;
