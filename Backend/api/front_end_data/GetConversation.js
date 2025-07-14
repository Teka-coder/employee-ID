const express = require("express");
const {
  getConversations,
  getFullName,
  getoffiName,
} = require("../../utils/operationmethods");
const database = require;
const router = express.Router();

router.use(express.json());

router.post("/", async (request, response) => {
  const wholeId = request.body.id.split("_");
  const id = wholeId[wholeId.length - 1]
  try {
    const result = await getConversations(id);
    if (result !== false && wholeId.length === 4) {
      const dataPromises =  result.map(async (row) => {
          let fullName =  await getFullName(row.sender).then(result => result).catch(error => error)
          let officeName = await getoffiName(row.office_id).then(result => result).catch(error => error)
          return [
            row.id,
            row.request_id,
            fullName,
            row.message,
            row.internal,
            officeName,
            row.img_src,
            row.time
          ];
        })
      const data = await Promise.all(dataPromises);
      response.status(200).json(data);
    } else {
      response.status(500).json({ message: "error occured!" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "error occured!" });
  }
});

module.exports = router;
