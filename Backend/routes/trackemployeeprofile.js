const express = require('express');
const router = express.Router();
const database = require('../utils/database');

// Route to get employee profile by unique ID
router.get('/:employeeid', (req, res) => {
    console.log("i trackemployeeprofile get touched..")
    const { employeeid } = req.params;
  
    // Query the database for the employee with the provided employeeid
    const sql = 'SELECT * FROM employee WHERE emptrack_id = ?';
    database.query(sql, [employeeid], (error, results) => {
      if (error) {
        console.log("error "+error)
        return res.status(500).json({ success: false, message: 'server error' });
      }
  
      if (results.length > 0) {
        // If employee found, return the employee data
        console.log("employee "+results[0])
        return res.status(200).json({ success: true, employee: results[0] });
      } else {
        // If no employee found with the given ID
        console.log("no employee found")
        return res.status(404).json({ success: false, message: 'Employee not found' });
      }
    });
  });
  
  module.exports = router;
  