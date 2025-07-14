const express = require("express");
const { getOfficeName } = require("../helpers/databaseHelpers");
const router = express.Router();
router.use(express.json());

router.post("/", (request, response) => {
    const id = request.body.id
    getOfficeName(id).then(result => {
        response.json(result).status(200)
    }).catch(error => console.log(error))
});

module.exports = router