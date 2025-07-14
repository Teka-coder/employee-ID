const express = require("express");
const database = require("../../utils/database");
const { getCategoryName } = require("../../utils/operationmethods");
const router = express.Router();
router.use(express.json());

router.get("/", (request, response) => {
  const id = request.session.emp_id;
  const sql = `SELECT * FROM cfs_feedback WHERE feedback_assigned_to = ${id}`;
  database.query(sql, async (error, result) => {
    if (error) {
      response.status(500).json({ error: 'Database query failed' });
      return;
    } else {
      const dataPromises = await result.map((row) => {
        return getCategoryName(row.category).then(result => {
          if(result !== false){
            return [row.feedback_id,
              row.first_name +" "+ row.middle_name,
              result,
              row.feedback_description,
              row.feedback_status,
              row.new_message,
              row.feedback_time,
              row.feedback_tracking_id];
          }
        });
      });

      const data = await Promise.all(dataPromises)
        .then(data => {
          response.status(200).json(data);
        })
        .catch(err => {
          response.status(500).json({ error: 'Failed to get category names' });
        });
    }
  });
});

module.exports = router;
