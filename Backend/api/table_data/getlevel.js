const express = require("express");
const database = require("../../utils/database");
const router = express.Router();

router.get("/", (request, response) => {
  const sql = "SELECT level_id, level_name FROM cfs_job_level";
  database.query(sql, (error, result) => {
    if(error){
        response.status(500).send("<p>Internal Server Error</p>")
    }else{
        const data = result.map(row => [row.level_id, row.level_name])
        response.status(200).json(data)
    }
  });
});

module.exports = router
