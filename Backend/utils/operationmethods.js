const database = require("../utils/database");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const uuid = require("uuid");
const assignTicketTo = (ticket_id, office_id, emp_id) => {
  return new Promise((resolve, reject) => {
    const sql = `Update cfs_feedback SET feedback_assigned_to = ${emp_id} , feedback_office = ${office_id} WHERE feedback_id = ${ticket_id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  });
};

const esclateTicket = (ticket_id, office_id, emp_level, current_emp) => {
  return new Promise((resolve, reject) => {
    if (emp_level === "low") {
      const sqlForMid = `SELECT emp_id FROM cfs_employee WHERE hierarchy = 'mid' AND emp_job_office = ${office_id} AND emp_status = 1 ORDER BY assigned_requests_amount ASC`;
      database.query(sqlForMid, (error, result) => {
        if (error) {
          resolve(false);
        } else if (result.length === 0) {
          const sqlForHigh = `SELECT emp_id FROM cfs_employee WHERE hierarchy = 'high' AND emp_job_office = ${office_id} AND emp_status = 1 ORDER BY assigned_requests_amount ASC`;
          database.query(sqlForHigh, (error, result) => {
            if (error) {
              resolve(false);
            } else if (result.length === 0) {
              assignTicketToParentOffice(ticket_id, office_id, current_emp)
                .then((result) => {
                  if (result === true) {
                    resolve(true);
                  } else {
                    resolve(false);
                  }
                })
                .catch((error) => reject(false));
            } else {
              const emp_id = result[0].emp_id;
              assignTicketTo(ticket_id, office_id, emp_id)
                .then((result) => {
                  if (result) {
                    decreaseAssignedRequestAmount(current_emp);
                    increaseAssignedRequestAmount(emp_id);
                    resolve(true);
                  } else {
                    resolve(false);
                  }
                })
                .catch((error) => resolve(false));
            }
          });
        } else {
          const emp_id = result[0].emp_id;
          assignTicketTo(ticket_id, office_id, emp_id)
            .then((result) => {
              if (result) {
                decreaseAssignedRequestAmount(current_emp);
                increaseAssignedRequestAmount(emp_id);
                resolve(true);
              } else {
                resolve(false);
              }
            })
            .catch((error) => resolve(false));
        }
      });
    } else if (emp_level === "mid") {
      const sqlForHigh = `SELECT emp_id FROM cfs_employee WHERE hierarchy = 'high' AND emp_job_office = ${office_id} AND emp_status = 1 ORDER BY assigned_requests_amount ASC`;
      database.query(sqlForHigh, (error, result) => {
        if (error) {
          resolve(false);
        } else if (result.length === 0) {
          assignTicketToParentOffice(ticket_id, office_id, current_emp)
            .then((result) => {
              if (result === true) {
                resolve(true);
              } else {
                resolve(false);
              }
            })
            .catch((error) => reject(false));
        } else {
          const emp_id = result[0].emp_id;
          assignTicketTo(ticket_id, office_id, emp_id)
            .then((result) => {
              if (result) {
                decreaseAssignedRequestAmount(current_emp);
                increaseAssignedRequestAmount(emp_id);
                resolve(true);
              } else {
                resolve(false);
              }
            })
            .catch((error) => resolve(false));
        }
      });
    } else if (emp_level === "high") {
      return assignTicketToParentOffice(ticket_id, office_id, current_emp)
        .then((result) => {
          if (result === true) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((error) => {
          console.log("I am at the catch block");
          reject(false);
        });
    }
  });
};

const getTicketByid = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM cfs_feedback WHERE feedback_id = ${id}`;
    database.query(sql, async (error, result) => {
      if (error) {
        reject(false);
      } else {
        const dataPromise = result.map((row) => {
          return getCategoryName(row.category).then((result) => {
            if (result !== false) {
              return [
                row.first_name + " " + row.middle_name,
                row.phonenumber,
                result,
                row.username,
                row.feedback_id,
                row.feedback_time,
                row.feedback_description,
                row.feedback_assigned_to,
                row.feedback_status,
                getDiffereceInMinutes(row.feedback_next_deadline),
                row.category,
                row.feedback_office,
                row.feedback_tracking_id,
                row.email
              ];
            } else {
              return false;
            }
          });
        });
        const data = await Promise.all(dataPromise).then((result) => {
          return result[0];
        });
        resolve(data);
      }
    });
  }).catch((error) => false);
};

const getTicketByTrackingId = (tid) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM cfs_feedback WHERE feedback_tracking_id = ?`;
    database.query(sql, [tid], async (error, result) => {
      if (error) {
        reject(false);
      } else {
        const dataPromise = result.map((row) => {
          return getCategoryName(row.category).then((result) => {
            if (result !== false) {
              return [
                row.first_name + " " + row.middle_name,
                row.phonenumber,
                result,
                row.username,
                row.feedback_id,
                row.feedback_time,
                row.feedback_description,
                row.feedback_assigned_to,
                row.feedback_status,
                getDiffereceInMinutes(row.feedback_next_deadline),
                row.category,
                row.feedback_office,
                row.feedback_tracking_id,
              ];
            } else {
              return false;
            }
          });
        });
        const data = await Promise.all(dataPromise).then((result) => {
          return result[0];
        });
        resolve(data);
      }
    });
  }).catch((error) => false);
};

const getEmpById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM cfs_employee WHERE emp_id = ${id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        const data = result.map((row) => row.hierarchy);
        resolve(data[0]);
      }
    });
  }).catch((error) => error);
};
const setNextDeadLine = (id, deadlineTime) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE cfs_feedback SET feedback_next_deadline = NOW() + INTERVAL ${deadlineTime} MINUTE WHERE feedback_id = ${id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  }).catch((error) => false);
};

const increaseAssignedRequestAmount = (emp_id) => {
  return getAssignedRequestAmount(emp_id).then((result) => {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE cfs_employee SET assigned_requests_amount = ${
        result + 1
      } WHERE emp_id=${emp_id}`;
      database.query(sql, (error, result) => {
        if (error) {
          reject(false);
        } else {
          resolve(true);
        }
      });
    });
  });
};

const decreaseAssignedRequestAmount = (emp_id) => {
  return getAssignedRequestAmount(emp_id).then((result) => {
    return new Promise((resolve, reject) => {
      if(result === undefined || result === null){
        resolve(true)
      }
      const sql = `UPDATE cfs_employee SET assigned_requests_amount = ${
        result - 1
      } WHERE emp_id=${emp_id}`;
      database
        .query(sql, (error, queryResult) => {
          if (error) {
            reject(error); 
          } else {
            resolve(true); 
          }
        })
    });
  });
};

const getAssignedRequestAmount = (emp_id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT assigned_requests_amount FROM cfs_employee WHERE emp_id = ${emp_id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result[0].assigned_requests_amount);
      }
    });
  });
};

const updateRequestStatus = (request_id, status) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE cfs_feedback SET feedback_status = '${status}' WHERE feedback_id = ${request_id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
};

const getParentOffice = (office_id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT office_parent FROM cfs_offices WHERE office_id = ${office_id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else if (result.length === 0) {
        reject(false);
      } else {
        resolve(result[0].office_parent);
      }
    });
  });
};

const getEmpWithLowTickets = (office_id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT emp_id FROM cfs_employee WHERE hierarchy = 'low' AND emp_job_office = ${office_id} AND emp_status = 1 ORDER BY assigned_requests_amount ASC`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        if (result.length === 0) {
          const sqlForMid = `SELECT emp_id FROM cfs_employee WHERE hierarchy = 'mid' AND emp_job_office = ${office_id} AND emp_status = 1 AND emp_status = 1 ORDER BY assigned_requests_amount ASC`;
          database.query(sqlForMid, (error, result) => {
            if (error) {
              reject(false);
            } else {
              if (result.length === 0) {
                const sqlForHigh = `SELECT emp_id FROM cfs_employee WHERE hierarchy = 'high' AND emp_job_office = ${office_id} AND emp_status = 1 ORDER BY assigned_requests_amount ASC`;
                database.query(sqlForHigh, (error, result) => {
                  if (error) {
                    reject(false);
                  } else if (result.length === 0) {
                    reject(false);
                  } else {
                    resolve(result[0].emp_id);
                  }
                });
              }
            }
          });
        } else {
          resolve(result[0].emp_id);
        }
      }
    });
  });
};
const assignTicketToOffice = (ticket_id, office_id) => {
  return getEmpWithLowTickets(office_id)
    .then((result) => {
      if (result === false) {
        return false;
      } else {
        const new_emp = result;
        return assignTicketTo(ticket_id, office_id, new_emp)
          .then((result) => {
            increaseAssignedRequestAmount(new_emp);
            return true;
          })
          .catch((error) => {
            return false;
          });
      }
    })
    .catch((error) => false);
};
const assignTicketToParentOffice = async (ticket_id, office_id, emp_id) => {
  return getParentOffice(office_id)
    .then((result) => {
      if (result === null) {
        return decreaseAssignedRequestAmount(emp_id).then((result) => {
          if (result === true) {
            return assignTicketTo(ticket_id, null, null).then((result) => {
              if (result === true) {
                return updateRequestStatus(ticket_id, "Unassigned").then(
                  (result) => {
                    if (result === true) {
                      return true;
                    } else {
                      return false;
                    }
                  }
                );
              } else {
              }
            });
          } else {
            return false;
          }
        });
      } else {
        const parentOffice = result;
        return assignTicketToOffice(ticket_id, parentOffice).then((result) => {
          if (result === true) {
            return decreaseAssignedRequestAmount(emp_id).then((result) => {
              return true;
            });
          }
        });
      }
    })
    .catch((error) => false);
};

const abortRequest = (request_id) => {
  return updateRequestStatus(request_id, 'Aborted').then(result => {
    if(result){
      return true
    }else{
      return false
    }
  }).catch(error => false)
};

const insertMessage = (request_id, userType, message) => {
  const type='text';
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO cfs_chat(request_id, internal, message,type) VALUES(?,?,?,?)`;
    database.query(sql, [request_id, userType, message,type], (error, result) => {
      if (error) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  });
};

const getFullName = async (user_id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT emp_firstname, emp_middlename FROM cfs_employee WHERE emp_id = ${user_id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        if (result.length === 0) {
          reject(false);
        } else {
          const data = result.map((row) => [
            row.emp_firstname + " " + row.emp_middlename,
          ]);
          resolve(data[0][0]);
        }
      }
    });
  });
};

const getoffiName = (office_id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT office_name FROM cfs_offices WHERE office_id = ${office_id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        if (result.length === 0) {
          reject(false);
        } else {
          const data = result.map((row) => row.office_name);
          resolve(data[0]);
        }
      }
    });
  });
};

const insertMessageManagment = (
  request_id,
  userType,
  userid,
  message,
  office_id
) => {
  return new Promise((resolve, reject) => {
    const type='text';
    const sql = `INSERT INTO cfs_chat(request_id, internal, message,sender,office_id,type) VALUES(?,?,?,?,?,?)`;
    database.query(
      sql,
      [request_id, userType, message, userid, office_id,type],
      (error, result) => {
        if (error) {
          reject(false);
        } else {
          getTicketByid(request_id).then(result => {
            sendMailForChat(result[13],result[12])
          }).catch(error => console.log(false))
          resolve(true);
        }
      }
    );
  });
};

const getConversations = (request_id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id,time,sender,message,internal,office_id,img_src FROM cfs_chat WHERE request_id = ? ORDER BY time ASC`;
    database.query(sql, [request_id] ,(error, result) => {
      if (error) {
        console.log(error);
        reject(false);
      } else {
        resolve(result);
      }
    });
  });
};

const insertClosedTime = (request_id) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE cfs_feedback SET feedback_closed_at = NOW() WHERE feedback_id = ${request_id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
};

const getCategories = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM cfs_category";
    database.query(sql, (error, result) => {
      if (error) {
        reject(error);
      } else {
        const data = result.map((row) => [
          row.category_id,
          row.category_name,
          row.category_time,
        ]);
        resolve(data);
      }
    });
  });
};

const getFeedBackDeadline = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT feedback_next_deadline FROM cfs_feedback WHERE feedback_id = ${id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        const data = result.map((row) => row.feedback_next_deadline);
        resolve(data[0]);
      }
    });
  }).catch((error) => false);
};

const insertCategory = (category_name, category_time) => {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO cfs_category(category_name, category_time) VALUES(?,?)`;
    database.query(sql, [category_name, category_time], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
};

const getCategoryName = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT category_name FROM cfs_category WHERE category_id = ${id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        const data = result.map(async (row) => await row.category_name);
        resolve(data[0]);
      }
    });
  }).catch((error) => false);
};
const getEmployeeName = async (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT emp_firstname,emp_middlename FROM cfs_employee WHERE emp_id = ${id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        const data = result.map(async (row) => await row.emp_firstname+" "+row.emp_middlename);
        resolve(data[0]);
      }
    });
  }).catch((error) => false);
};
const getDiffereceInMinutes = (time) => {
  if (time) {
    const currentTime = new Date();
    const deadlineDate = new Date(time);
    const difference = Math.floor((deadlineDate - currentTime) / 1000 / 60);
    if (difference <= 0) {
      return 0;
    }
    return difference;
  } else {
    return 0;
  }
};

const getTicketTrackingId = (id) => {
  const date = new Date();
  const unique_id = `tkt_${date.getDate()}${date.getMonth()}${date.getFullYear()}_${uuid
    .v1()
    .substring(0, 8)}_${id}`;
  return new Promise((resolve, reject) => {
    const sql = `UPDATE cfs_feedback SET feedback_tracking_id ='${unique_id}' WHERE feedback_id = ${id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        resolve(unique_id);
      }
    });
  }).catch((error) => false);
};

const sendMail = (receiver, tkt_number) => {
  let mailTransporter = nodemailer.createTransport({
    host:'mail.alphagenuine.net',
    port:465,
    secure:true,
    auth: {
      user: "cfs@alphagenuine.net",
      pass: "Y*T+@rO5KOEb",
    },
    tls:{
      rejectUnauthorized:false
    }
  });
  let mailDetail = {
    from: "cfs@alphagenuine.net",
    to: receiver,
    subject: "Request Tracking ID",
    html: `
      <h1>Welcome!</h1>
      <p>Thank you for your request. Here is your tracking ID:</p>
      <h2>${tkt_number}</h2>
      <p><a href="https://customer.alphagenuine.net/chat/${tkt_number}">Click here</a>, to talk to our customer service agent.</p>
    `,
  };
  mailTransporter.sendMail(mailDetail, (error, data) => {
    if (error) {
      return false;
    } else {
      return true;
    }
  });
};

const sendMailForChat = (receiver, tkt_number) => {
  let mailTransporter = nodemailer.createTransport({
    host:'mail.alphagenuine.net',
    port:465,
    secure:true,
    auth: {
      user: "cfs@alphagenuine.net",
      pass: "Y*T+@rO5KOEb",
    },
    tls:{
      rejectUnauthorized:false
    }
  });
  let mailDetail = {
    from: "cfs@alphagenuine.net",
    to: receiver,
    subject: "Request Tracking ID",
    html: `
      <h1>Hello!</h1>
      <p>There is a new response from our staff with:</p>
      <h2>${tkt_number}</h2>
      <p><a href="https://customer.alphagenuine.net/chat/${tkt_number}">Click here</a>, to continue talking to our customer service agent.</p>
    `,
  };
  mailTransporter.sendMail(mailDetail, (error, data) => {
    if (error) {
      return false;
    } else {
      return true;
    }
  });
};

const encryptPassword = async (password) => {
  const encPassword = await bcrypt.hash(password, 10);
  return encPassword;
};

const comparePassword = async (encPassword, storedPassword) => {
  const equal = await bcrypt.compare(encPassword, storedPassword);
  return equal;
};

module.exports = {
  getAssignedRequestAmount,
  getFullName,
  getoffiName,
  assignTicketTo,
  increaseAssignedRequestAmount,
  decreaseAssignedRequestAmount,
  updateRequestStatus,
  getParentOffice,
  getEmpWithLowTickets,
  esclateTicket,
  abortRequest,
  assignTicketToOffice,
  assignTicketToOffice,
  assignTicketToParentOffice,
  insertMessage,
  getConversations,
  insertMessageManagment,
  insertClosedTime,
  getCategories,
  insertCategory,
  getCategoryName,
  getEmployeeName,
  getDiffereceInMinutes,
  getEmpById,
  getTicketTrackingId,
  sendMail,
  getTicketByTrackingId,
  encryptPassword,
  comparePassword,
  sendMailForChat
};
