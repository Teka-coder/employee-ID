const express = require("express");
const database = require("../../utils/database");
const {
  getDefaultOffice,
  getCategoryTime,
  getTicketByid,
  setNextDeadLine,
} = require("../../api/helpers/databaseHelpers");
const {
  assignTicketTo,
  increaseAssignedRequestAmount,
  updateRequestStatus,
  getTicketTrackingId,
  sendMail,
} = require("../../utils/operationmethods");
const router = express.Router();
router.use(express.json());

router.post("/", (request, response) => {
  const res = request.body;
  let defaultOfficeId = 0;
  const sql =
    "INSERT INTO cfs_feedback(first_name,middle_name, last_name, username, email,phonenumber, category,feedback_description) VALUES(?,?,?,?,?,?,?,?)";
  database.query(
    sql,
    [
      res.firstName,
      res.middleName,
      res.lastName,
      res.userName,
      res.email,
      res.phone,
      res.category,
      res.query,
    ],
    (error, result) => {
      if (error) {
        response.status(500).json({ message: error });
      } else {
        const insertedTicketId = result.insertId;
        getDefaultOffice().then((result) => {
          defaultOfficeId = result;
          const sqlForLow = `SELECT * FROM cfs_employee WHERE hierarchy = 'low' AND emp_job_office = ${defaultOfficeId} AND emp_status = 1 AND is_online = 1 ORDER BY assigned_requests_amount ASC`;
          database.query(sqlForLow, (error, result) => {
            if (error) {
              response.status(500).json({ message: error });
            } else if (result.length === 0) {
              const sqlForMid = `SELECT * FROM cfs_employee WHERE hierarchy = 'mid' AND emp_job_office = ${defaultOfficeId} AND emp_status = 1 ORDER BY assigned_requests_amount ASC`;
              database.query(sqlForMid, (error, result) => {
                if (error) {
                  response.status(500).json({ message: error });
                } else if (result.length === 0) {
                  const sqlForHigh = `SELECT * FROM cfs_employee WHERE hierarchy = 'high' AND emp_job_office = ${defaultOfficeId} AND emp_status = 1 ORDER BY assigned_requests_amount ASC`;
                  database.query(sqlForHigh, (error, result) => {
                    if (error) {
                      response.status(500).json({ message: error });
                    } else if (result.length === 0) {
                      // Just insert but not assigned
                      getTicketTrackingId(insertedTicketId).then((result) => {
                        sendMail(res.email, result);
                        response.json({ id: result }).status(200);
                      });
                    } else {
                      // assign to high
                      let emp_id = result[0].emp_id;
                      assignTicketTo(
                        insertedTicketId,
                        defaultOfficeId,
                        emp_id
                      ).then((result) => {
                        if (result) {
                          getTicketByid(insertedTicketId)
                            .then((result) => {
                              if (result !== false) {
                                getCategoryTime(result[14])
                                  .then((result) => {
                                    setNextDeadLine(insertedTicketId, result);
                                    increaseAssignedRequestAmount(emp_id).then(
                                      (result) => console.log(result)
                                    );
                                    updateRequestStatus(
                                      insertedTicketId,
                                      "InProgress"
                                    )
                                      .then((result) => result)
                                      .catch((error) => error);
                                    getTicketTrackingId(insertedTicketId).then(
                                      (result) => {
                                        sendMail(res.email, result);
                                        response
                                          .json({ id: result })
                                          .status(200);
                                      }
                                    );
                                  })
                                  .catch((error) => console.log(error));
                              } else {
                                return false;
                              }
                            })
                            .catch((error) => false);
                        }
                      });
                    }
                  });
                } else {
                  // inserting for mid
                  let emp_id = result[0].emp_id;
                  assignTicketTo(
                    insertedTicketId,
                    defaultOfficeId,
                    emp_id
                  ).then((result) => {
                    let time = 0;
                    if (result) {
                      getTicketByid(insertedTicketId)
                        .then((result) => {
                          if (result !== false) {
                            getCategoryTime(result[14])
                              .then((result) => {
                                setNextDeadLine(insertedTicketId, result);
                                increaseAssignedRequestAmount(emp_id).then(
                                  (result) => console.log(result)
                                );
                                updateRequestStatus(
                                  insertedTicketId,
                                  "InProgress"
                                )
                                  .then((result) => result)
                                  .catch((error) => error);
                                getTicketTrackingId(insertedTicketId).then(
                                  (result) => {
                                    sendMail(res.email, result);
                                    response.json({ id: result }).status(200);
                                  }
                                );
                              })
                              .catch((error) => console.log(error))

                              .catch((error) => console.log(error));
                          } else {
                            return false;
                          }
                        })
                        .catch((error) => false);
                    }
                  });
                }
              });
            } else {
              // inserting for low
              let emp_id = result[0].emp_id;
              assignTicketTo(insertedTicketId, defaultOfficeId, emp_id).then(
                (result) => {
                  let time = 0;
                  if (result) {
                    getTicketByid(insertedTicketId)
                      .then((result) => {
                        if (result !== false) {
                          getCategoryTime(result[14])
                            .then((result) => {
                              setNextDeadLine(insertedTicketId, result);
                              increaseAssignedRequestAmount(emp_id).then(
                                (result) => console.log(result)
                              );
                              updateRequestStatus(
                                insertedTicketId,
                                "InProgress"
                              )
                                .then((result) => result)
                                .catch((error) => error);
                              getTicketTrackingId(insertedTicketId).then(
                                (result) => {
                                  sendMail(res.email, result);
                                  response.json({ id: result }).status(200);
                                }
                              );
                            })
                            .catch((error) => console.log(error))

                            .catch((error) => console.log(error));
                        } else {
                          return false;
                        }
                      })
                      .catch((error) => false);
                  }
                }
              );
            }
          });
        });
      }
    }
  );
});

module.exports = router;