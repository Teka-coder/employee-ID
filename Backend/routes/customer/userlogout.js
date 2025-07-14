
const express = require("express");
const { setOffline } = require("../../api/helpers/databaseHelpers");
const router = express.Router();

router.get("/", (request, response) => {
  // setOffline handles setting user offline status in database
  setOffline(request.session.acc_id)
    .then(() => {
      request.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          response.status(500).json({ status: "failed" });
        } else {
          response.clearCookie("session-id"); // Clear the session cookie
          response.status(200).json({ message: "logged out" });
          console.log("Employee logged out successfully");
        }
      });
    })
    .catch((error) => {
      console.error("Error setting user offline:", error);
      response.status(500).json({ status: "failed" });
    });
});

module.exports = router;
