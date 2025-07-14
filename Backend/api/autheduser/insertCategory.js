const express = require("express");
const { insertCategory } = require("../../utils/operationmethods");
const router = express.Router();
router.use(express.json());

router.post("/", async (request, response) => {
  const { category, time } = request.body;
  insertCategory(category, time)
    .then((result) => {
      if (result) {
        response.status(200).json({ message: "successful" });
      } else {
        response.status(500).json({ message: "failed" });
      }
    })
    .catch((error) => {
      response.status(500).json({ message: "failed" });
    });
});

module.exports = router;
