const express = require('express')
const database = require('../../utils/database')
const router = express.Router()
router.use(express.json())

router.get("/", (request, response) => {
    const sql = "SELECT emp_id, emp_firstname, emp_middlename, emp_middlename FROM cfs_employee";
    database.query(sql, (error, result) => {
        if (error) {
            response.status(500).send(error);
            return;
        }
        const data = result.map(data => [data.emp_id,data.emp_firstname + " " + data.emp_middlename]);
        response.status(200).json(data)
    });
});

module.exports = router