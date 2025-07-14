const express = require('express');
const router = express.Router();
const database = require('../utils/database');

// Route to get employee details by unique ID
router.get('/:employeeid', (req, res) => {
    console.log("i employeeprofile get touched...")
    const { employeeid } = req.params;

    const sql = `SELECT * FROM employee WHERE emptrack_id = ?`;

    database.query(sql, [employeeid], (error, results) => {
        if (error) {
            console.log("Error fetching employee data:", error);
            return res.status(500).json({ message: "Error fetching employee data." });
        }

        if (results.length === 0) {
            console.log("no employee found here")
            return res.status(404).json({ message: "Employee not found." });
        }

        const employee = results[0];
        console.log("employee found ")
        res.status(200).json({ employee });
    });
});

module.exports = router;
