const express = require("express");
const { setNewMessageFalse } = require("../helpers/databaseHelpers");
const router = express.Router();
router.use(express.json());

router.post("/", (request, response) => {
  const id = request.body.id;
  try {
    setNewMessageFalse(id);
    response.status(200).json({ message: "success" });
  } catch (error) {
    response.status(500).json({ message: "failed" });
  }
});

module.exports = router;
