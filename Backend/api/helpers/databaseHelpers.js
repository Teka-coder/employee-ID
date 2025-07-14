const database = require("../../utils/database");
const pool = require("../../utils/pool");
const moment = require("moment");
const {
  getCategoryName,
  getEmployeeName,
  getDiffereceInMinutes,
  encryptPassword,
  getEmpById,
} = require("../../utils/operationmethods");

const getEmployeeFullName = (id) => {
  return new Promise((resolve, reject) => {
    if (id) {
      const sql =
        "SELECT emp_firstname, emp_middlename, emp_lastname FROM cfs_employee WHERE emp_id = ?";
      database.query(sql, [id], (error, result) => {
        if (error) {
          resolve("");
        } else {
          resolve(result[0].emp_firstname + " " + result[0].emp_middlename);
        }
      });
    } else {
      resolve("");
    }
  });
};

const getOfficeName = (id) => {
  try {
    if (id === null) {
      return "-";
    } else {
      return new Promise((resolve, reject) => {
        const sql = `SELECT office_name FROM cfs_offices WHERE office_id = ${id}`;
        database.query(sql, [id], (error, result) => {
          if (error) {
            reject(error);
          } else if (result.length === 0) {
            reject(error);
          } else {
            resolve(result[0].office_name);
          }
        });
      });
    }
  } catch (error) {
    reject(error);
  }
};

const getBranchName = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT branch_name FROM cfs_branches WHERE branch_id = ${id}`;
    database.query(sql, [id], (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result[0].branch_name);
      }
    });
  });
};

const getTitleName = (id) => {
  const sql = `SELECT title_name FROM cfs_job_title WHERE title_id = ${id}`;
  return new Promise((resolve, reject) => {
    database.query(sql, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result[0].title_name);
      }
    });
  });
};

const getLevelName = (id) => {
  const sql = `SELECT level_name FROM cfs_job_level WHERE level_id = ${id}`;
  return new Promise((resolve, reject) => {
    database.query(sql, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result[0].level_name);
      }
    });
  });
};

const getDefaultOffice = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT office_id FROM cfs_default_office WHERE id = 2";
    database.query(sql, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result[0].office_id);
      }
    });
  });
};

const getAllTickets = () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM cfs_feedback LEFT JOIN cfs_employee ON cfs_employee.emp_id=cfs_feedback.feedback_assigned_to";
    database.query(sql, async (error, result) => {
      if (error) {
        reject(false);
      } else {
        const dataPromise = result.map((row) => {
          return getCategoryName(row.category).then((result) => {
            if (result != false) {
              return [
                row.first_name + " " + row.middle_name,
                row.phonenumber,
                result,
                row.username,
                row.feedback_id,
                row.feedback_time,
                row.feedback_description,
                row.feedback_status,
                row.feedback_tracking_id,
                row.emp_firstname,
                row.emp_middlename,
              ];
            } else {
              return false;
            }
          });
        });
        const data = await Promise.all(dataPromise).then((result) => {
          resolve(result);
        });
      }
    });
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
              let full_name = row.first_name + " " + row.middle_name;
              let phonenumber = row.phonenumber;
              let category = result;
              let username = row.username;
              let feedback_id = row.feedback_id;
              let feedback_time = row.feedback_time;
              let feedback_description = row.feedback_description;
              let feedback_assigned_to = row.feedback_assigned_to;
              let feedback_status = row.feedback_status;
              let feedback_next_deadline = getDiffereceInMinutes(
                row.feedback_next_deadline
              );
              let feedback_category = row.category;
              let feedback_office = row.feedback_office;
              let feedback_tracking_id = row.feedback_tracking_id;
              return getEmployeeFullName(feedback_assigned_to)
                .then((result) => {
                  return [
                    full_name,
                    phonenumber,
                    category,
                    username,
                    feedback_id,
                    feedback_time,
                    feedback_description,
                    feedback_assigned_to,
                    feedback_status,
                    feedback_next_deadline,
                    category,
                    feedback_office,
                    feedback_tracking_id,
                    result,
                    feedback_category,
                  ];
                })
                .catch((error) => false);
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

// // Function to fetch user profile by userId
// const getUserProfile = async (Userid) => {
//   const sql = `SELECT * FROM user WHERE user_id = ?`;
//   try {
//     const [rows, fields] = await pool.query(sql, [Userid]);
//     if (rows.length === 0) {
//       return null; // Return null if no profile found
//     }
//     return rows[0]; // Return the first profile found
//   } catch (error) {
//     console.error('API says Error in getUserProfile:', error);
//     throw new Error('API says Failed to fetch user profile');
//   }
// };

// const getUserProfile = (userId) => {
//   return new Promise((resolve, reject) => {
//     if (userId) {
//       const stat = 1;
//   const sql = `
//     SELECT *
//     FROM user
//     INNER JOIN cfs_feedback ON cfs_feedback.user = user.user_id
//     WHERE user.user_id = ?
//     AND user.user_status = ?
//   `;
//       // const sql =
//       //   "SELECT * FROM user WHERE user_id = ?";
//       try{
//       const [rows, fields]=  database.query(sql, [userId,stat], (error, result) => {
//         if (error) {
//           resolve("");
//         } else {
//           resolve(result[0]);
//         }
//       });
//       return rows[0];
//     }catch (error) {
//       throw new Error('API says Failed to fetch user profile');
//     }
//     } else {
//       resolve("");
//     }
//   });
// };

// const getUserProfile = (userId) => {
//   return new Promise((resolve, reject) => {
//     if (userId) {
//       const stat = 1;
//       const sql = `
//         SELECT *
//         FROM user
//         INNER JOIN cfs_feedback ON cfs_feedback.user = user.user_id
//         WHERE user.user_id = ?
//         AND user.user_status = ?
//       `;

//       database.query(sql, [userId, stat], (error, result) => {
//         if (error) {
//           console.error('dbhelper says Error executing query:', error);
//           reject(new Error('dbhelper says Failed to fetch user profile'));
//         } else {
//           if (result.length === 0) {
//             reject(new Error('dbhelper says User profile not found'));
//           } else {
//             resolve(result[0]);
//           }
//         }
//       });
//     } else {
//       resolve(null);
//     }
//   });
// };


const getUserProfile = (userId) => {
  return new Promise((resolve, reject) => {
    if (userId) {
      const stat = 1;
      const sql = `
        SELECT *
        FROM user
        WHERE user_id = ?
        AND user.user_status = ?
      `;
//SELECT *FROM userLEFT JOIN cfs_feedback ON cfs_feedback.user = user.user_id WHERE user.user_id = ? AND user.user_status = ?
      database.query(sql, [userId, stat], (error, result) => {
        if (error) {
          console.error('Error executing query:', error);
          reject(new Error('Failed to fetch user profile'));
        } else {
          console.log('Query result:', result); // Log the result
          if (result.length === 0) {
            console.error('User profile not found for userId:', userId); // Log not found
            reject(new Error('User profile not found'));
          } else {
            resolve(result[0]);
          }
        }
      });
    } else {
      resolve(null);
    }
  });
};

const updatePassword = (id, newPassword) => {
  return new Promise(async (resolve, reject) => {
    const encryptedPassword = await encryptPassword(newPassword);
    const sql = `UPDATE cfs_employee SET emp_password = '${encryptedPassword}', firstlogin = 0 WHERE emp_id = ${id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  }).catch((error) => false);
};
const updateProfile = (id, newfname,newlname,newphone) => {
  return new Promise(async (resolve, reject) => {
    const sql = `UPDATE cfs_employee SET emp_firstname = '${newfname}', emp_middlename = '${newlname}',emp_phonenumber='${newphone}' WHERE emp_id = ${id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  }).catch((error) => false);
};
const getCategoryTime = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT category_time FROM cfs_category WHERE category_id = ${id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else if (result.length === 0) {
        reject(false);
      } else {
        const data = result.map((row) => row.category_time);
        resolve(data[0]);
      }
    });
  }).catch((error) => false);
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

// Edit operations

const updateCategory = (id, name, time) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE cfs_category SET category_name = '${name}', category_time = ${time} WHERE category_id = ${id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  }).catch((error) => error);
};

const updateBranch = (id, branchName) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE cfs_branches SET branch_name = '${branchName}' WHERE branch_id = ${id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  }).catch((error) => false);
};
const updateOffice = (id, officeName, officeParent, officeBranch) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE cfs_offices SET office_name = '${officeName}', office_parent = ${officeParent}, office_branch = ${officeBranch} WHERE office_id = ${id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  }).catch((error) => false);
};

const updateLevel = (id, levelName) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE cfs_job_level SET level_name = '${levelName}' WHERE level_id = ${id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  }).catch((error) => false);
};

const editTitle = (id, titleName, titleParent) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE cfs_job_title SET title_name = '${titleName}', title_parent = ${titleParent} WHERE title_id = ${id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(true);
      }
    });
  }).catch((error) => false);
};

const editAccount = (
  id,
  empFirstName,
  empMiddleName,
  empLastName,
  empPhoneNumber,
  empEmail,
  empHierarchy,
  empTitle,
  empLevel,
  empOffice
) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE cfs_employee SET emp_firstname = '${empFirstName}', emp_middlename = '${empMiddleName}', emp_lastname = '${empLastName}', emp_phonenumber = '${empPhoneNumber}', emp_email = '${empEmail}', hierarchy = '${empHierarchy}', emp_job_title = ${empTitle}, emp_job_level = ${empLevel}, emp_job_office = ${empOffice} WHERE emp_id = ${id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  }).catch((error) => {
    return false;
  });
};

// delete & deactivate methods
const deleteCategory = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM cfs_category WHERE category_id = ${id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  }).catch((error) => false);
};
const deleteOffice = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM cfs_offices WHERE office_id = ${id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  }).catch((error) => false);
};

const deleteLevel = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM cfs_job_level WHERE level_id = ${id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  }).catch((error) => false);
};

const deleteTitle = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM cfs_job_title WHERE title_id = ${id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  }).catch((error) => false);
};
const deleteBranch = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `DELETE FROM cfs_branches WHERE branch_id = ${id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  }).catch((error) => false);
};
const deactivateUser = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE cfs_employee SET emp_status = 0 WHERE emp_id = ${id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  }).catch((error) => false);
};

const activateUser = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE cfs_employee SET emp_status = 1 WHERE emp_id = ${id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  }).catch((error) => false);
};

const resetPassword = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE cfs_employee SET firstlogin = 1, emp_password = '$2a$10$xneGVPaXw.iW2ayqORtLQuj774cmkCy4YrtA.8N6eZyt8O/E0AVu6' WHERE emp_id = ${id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        resolve(true);
      }
    });
  }).catch((error) => false);
};

const getMyExpiredTickets = (user_id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT tkt_id FROM cfs_expired WHERE user_id = ${user_id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        const data = result.map((res) => res.tkt_id);
        const ticketPromises = data.map((element) =>
          getTicketByIdForExpired(element)
        );
        Promise.all(ticketPromises)
          .then((tickets) => resolve(tickets))
          .catch((error) => reject(false));
      }
    });
  });
};

const getTicketByIdForExpired = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM cfs_feedback INNER JOIN cfs_expired ON cfs_expired.tkt_id=cfs_feedback.feedback_id WHERE cfs_feedback.feedback_id = ${id}`;
    database.query(sql, async (error, result) => {
      if (error) {
        reject(false);
      } else {
        const dataPromise = result.map((row) => {
          return getCategoryName(row.category).then((result) => {
            if (result !== false) {
              return [
                row.feedback_id,
                row.first_name + " " + row.middle_name,
                "EXPIRED",
                row.feedback_description,
                row.feedback_status,
                row.feedback_time,
                row.new_message,
                row.feedback_tracking_id,
                 row.expired_data_time
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

const getMyExpiryHistory = (id) => {
  return new Promise(async (resolve, reject) => {
    const sql = `SELECT user_id,expired_data_time FROM cfs_expired WHERE tkt_id = ${id}`;
    database.query(sql, async (error, result) => {
      if (error) {
        reject(error);
      } else {
        const data = await Promise.all(
          result.map(async (res) => {
            const name = await getEmployeeFullName(res.user_id);
            return [name, res.expired_data_time];
          })
        );
        resolve(data);
      }
    });
  }).catch((error) => false);
};

const getAttachedFiles = (id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT img_directory FROM cfs_chat_image WHERE request_id ='${id}'`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        const data = result.map((arr) => arr.img_directory);
        resolve(data);
      }
    });
  }).catch((error) => false);
};

const getOfficetickets = (officeId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT feedback_id,emp_firstname,emp_middlename,feedback_tracking_id,first_name, middle_name, category,feedback_status, feedback_description,feedback_time FROM cfs_feedback INNER JOIN cfs_employee ON cfs_employee.emp_id=cfs_feedback.feedback_assigned_to WHERE feedback_office = ${officeId}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        const dataPromises = result.map((row) => {
          return getCategoryName(row.category).then((categoryName) => {
            return [
              row.feedback_id,
              row.feedback_tracking_id,
              row.first_name + " " + row.middle_name,
              categoryName,
              row.feedback_status,
              row.feedback_description,
              row.feedback_time,
              row.emp_firstname+" "+row.emp_middlename
            ];
          });
        });
        resolve(Promise.all(dataPromises));
      }
    });
  });
};

const getMyChildOfficetickets = (officeId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT feedback_id,feedback_tracking_id,first_name, middle_name, category,feedback_status, feedback_description,feedback_time FROM cfs_feedback WHERE feedback_office = ${officeId}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        const dataPromises = result.map((row) => {
          return getCategoryName(row.category).then((categoryName) => {
            return [
              row.feedback_id,
              row.feedback_tracking_id,
              row.first_name + " " + row.middle_name,
              categoryName,
              row.feedback_status,
              row.feedback_description,
              row.feedback_time,
            ];
          });
        });
        resolve(Promise.all(dataPromises));
      }
    });
  });
};
const analysMyLowOfficetickets = (empid) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT feedback_id,feedback_tracking_id,first_name, middle_name, category,feedback_status, feedback_description,feedback_time FROM cfs_feedback WHERE feedback_assigned_to = ${empid}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        const dataPromises = result.map((row) => {
          return getCategoryName(row.category).then((categoryName) => {
            return [
              row.feedback_id,
              row.feedback_tracking_id,
              row.first_name + " " + row.middle_name,
              categoryName,
              row.feedback_status,
              row.feedback_description,
              row.feedback_time,
            ];
          });
        });
        resolve(Promise.all(dataPromises));
      }
    });
  });
};
const analysMyMidOfficetickets = (officeId) => {
  //feedback assigned to added just to minimize high hierarchy man
  return new Promise((resolve, reject) => {
    const sql = `SELECT feedback_id,feedback_tracking_id,first_name, middle_name, category,feedback_status, feedback_description,feedback_time FROM cfs_feedback INNER JOIN cfs_employee ON cfs_employee.emp_id=cfs_feedback.feedback_assigned_to  WHERE cfs_feedback.feedback_office = ${officeId} AND cfs_employee.hierarchy!='high' GROUP BY cfs_feedback.feedback_assigned_to`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        const dataPromises = result.map((row) => {
          return getCategoryName(row.category).then((categoryName) => {
            return [
              row.feedback_id,
              row.feedback_tracking_id,
              row.first_name + " " + row.middle_name,
              categoryName,
              row.feedback_status,
              row.feedback_description,
              row.feedback_time,
            ];
          });
        });
        resolve(Promise.all(dataPromises));
      }
    });
  });
};
const analysMyHighOfficetickets = (officeId) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT feedback_id,feedback_tracking_id,first_name, middle_name, category,feedback_status, feedback_description,feedback_time FROM cfs_feedback WHERE feedback_office = ${officeId}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        const dataPromises = result.map((row) => {
          return getCategoryName(row.category).then((categoryName) => {
            return [
              row.feedback_id,
              row.feedback_tracking_id,
              row.first_name + " " + row.middle_name,
              categoryName,
              row.feedback_status,
              row.feedback_description,
              row.feedback_time,
            ];
          });
        });
        resolve(Promise.all(dataPromises));
      }
    });
  });
};

const getMyLowOfficeTicketsForReport = (empid) => {
  return new Promise((resolve, reject) => {
   // console.log("Emp ID:", empid); // Log officeId

    const sql = `
      SELECT 
        cfs_employee.emp_id,
        cfs_employee.emp_firstname,
        cfs_feedback.feedback_time,
        COUNT(*) AS total_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'Resolved' THEN 1 ELSE 0 END) AS resolved_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'InProgress' THEN 1 ELSE 0 END) AS in_progress_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'Aborted' THEN 1 ELSE 0 END) AS aborted_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'Unassigned' THEN 1 ELSE 0 END) AS unassigned_tickets
      FROM 
        cfs_feedback 
      INNER JOIN 
        cfs_employee ON cfs_feedback.feedback_assigned_to = cfs_employee.emp_id 
      WHERE 
        cfs_feedback.feedback_assigned_to = ?  -- Use parameterized query for safety
      GROUP BY 
        cfs_employee.emp_id, cfs_employee.emp_firstname`;

    database.query(sql, [empid], (error, result) => {
      if (error) {
       // console.error("Database query error:", error); // Log the error
        reject(false);
      } else {
       // console.log("Query result:", result); // Log the result
        resolve(result);
      }
    });
  });
};




const getMyMidOfficeTicketsForReport = (officeId) => {
  return new Promise((resolve, reject) => {
   // console.log("Office ID:", officeId); // Log officeId

    const sql = `
      SELECT 
        cfs_employee.emp_id,
        cfs_employee.emp_firstname,
        cfs_feedback.feedback_time,
        COUNT(*) AS total_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'Resolved' THEN 1 ELSE 0 END) AS resolved_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'InProgress' THEN 1 ELSE 0 END) AS in_progress_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'Aborted' THEN 1 ELSE 0 END) AS aborted_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'Unassigned' THEN 1 ELSE 0 END) AS unassigned_tickets
      FROM 
        cfs_feedback 
      INNER JOIN 
        cfs_employee ON cfs_feedback.feedback_assigned_to = cfs_employee.emp_id 
      WHERE 
        cfs_feedback.feedback_office = ?  AND cfs_employee.hierarchy != 'high' -- Use parameterized query for safety
      GROUP BY 
        cfs_employee.emp_id, cfs_employee.emp_firstname`;

    database.query(sql, [officeId], (error, result) => {
      if (error) {
      //  console.error("Database query error:", error); // Log the error
        reject(false);
      } else {
     //   console.log("Query result:", result); // Log the result
        resolve(result);
      }
    });
  });
};

const getMyHighOfficeTicketsForReport = (officeId) => {
  return new Promise((resolve, reject) => {
   // console.log("Office ID:", officeId); // Log officeId

    const sql = `
      SELECT 
        cfs_employee.emp_id,
        cfs_employee.emp_firstname,
        cfs_feedback.feedback_time,
        COUNT(*) AS total_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'Resolved' THEN 1 ELSE 0 END) AS resolved_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'InProgress' THEN 1 ELSE 0 END) AS in_progress_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'Aborted' THEN 1 ELSE 0 END) AS aborted_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'Unassigned' THEN 1 ELSE 0 END) AS unassigned_tickets
      FROM 
        cfs_feedback 
      INNER JOIN 
        cfs_employee ON cfs_feedback.feedback_assigned_to = cfs_employee.emp_id 
      WHERE 
        cfs_feedback.feedback_office = ?  -- Use parameterized query for safety
      GROUP BY 
        cfs_employee.emp_id, cfs_employee.emp_firstname`;

    database.query(sql, [officeId], (error, result) => {
      if (error) {
       // console.error("Database query error:", error); // Log the error
        reject(false);
      } else {
       // console.log("Query result:", result); // Log the result
        resolve(result);
      }
    });
  });
};

const filterMyHighOfficeTicketsForReport = (officeId, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        cfs_employee.emp_id,
        cfs_employee.emp_firstname,
        cfs_feedback.feedback_time,
        COUNT(*) AS total_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'Resolved' THEN 1 ELSE 0 END) AS resolved_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'InProgress' THEN 1 ELSE 0 END) AS in_progress_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'Aborted' THEN 1 ELSE 0 END) AS aborted_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'Unassigned' THEN 1 ELSE 0 END) AS unassigned_tickets
      FROM 
        cfs_feedback 
      INNER JOIN 
        cfs_employee ON cfs_feedback.feedback_assigned_to = cfs_employee.emp_id 
      WHERE 
        cfs_feedback.feedback_office = ? 
        AND cfs_feedback.feedback_time BETWEEN ? AND ?  -- Date range filter
      GROUP BY 
        cfs_employee.emp_id, cfs_employee.emp_firstname, cfs_feedback.feedback_time`;

    database.query(sql, [officeId, startDate, endDate], (error, result) => {
      if (error) {
       // console.error("Database query error:", error);
        reject(false);
      } else {
       // console.log("Query result:", result);
        resolve(result);
      }
    });
  });
};
const filterMyMidOfficeTicketsForReport = (officeId, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        cfs_employee.emp_id,
        cfs_employee.emp_firstname,
        cfs_feedback.feedback_time,
        COUNT(*) AS total_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'Resolved' THEN 1 ELSE 0 END) AS resolved_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'InProgress' THEN 1 ELSE 0 END) AS in_progress_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'Aborted' THEN 1 ELSE 0 END) AS aborted_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'Unassigned' THEN 1 ELSE 0 END) AS unassigned_tickets
      FROM 
        cfs_feedback 
      INNER JOIN 
        cfs_employee ON cfs_feedback.feedback_assigned_to = cfs_employee.emp_id 
      WHERE 
        cfs_feedback.feedback_office = ? AND cfs_employee.hierarchy != 'high'
        AND cfs_feedback.feedback_time BETWEEN ? AND ?  -- Date range filter
      GROUP BY 
        cfs_employee.emp_id, cfs_employee.emp_firstname, cfs_feedback.feedback_time`;

    database.query(sql, [officeId, startDate, endDate], (error, result) => {
      if (error) {
       // console.error("Database query error:", error);
        reject(false);
      } else {
       // console.log("Query result:", result);
        resolve(result);
      }
    });
  });
};
const filterMyLowOfficeTicketsForReport = (empid, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        cfs_employee.emp_id,
        cfs_employee.emp_firstname,
        cfs_feedback.feedback_time,
        COUNT(*) AS total_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'Resolved' THEN 1 ELSE 0 END) AS resolved_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'InProgress' THEN 1 ELSE 0 END) AS in_progress_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'Aborted' THEN 1 ELSE 0 END) AS aborted_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'Unassigned' THEN 1 ELSE 0 END) AS unassigned_tickets
      FROM 
        cfs_feedback 
      INNER JOIN 
        cfs_employee ON cfs_feedback.feedback_assigned_to = cfs_employee.emp_id 
      WHERE 
        cfs_feedback.feedback_assigned_to = ? 
        AND cfs_feedback.feedback_time BETWEEN ? AND ?  -- Date range filter
      GROUP BY 
        cfs_employee.emp_id, cfs_employee.emp_firstname, cfs_feedback.feedback_time`;

    database.query(sql, [empid, startDate, endDate], (error, result) => {
      if (error) {
       // console.error("Database query error:", error);
        reject(false);
      } else {
       // console.log("Query result:", result);
        resolve(result);
      }
    });
  });
};


const getMyChildOfficeTicketsForReport = async (officeId) => {
  [childData] = await getChildOffices(officeId);
   // console.log("fetched child data "+childData[0]+childData[1])
  return new Promise((resolve, reject) => {
   // console.log("Child Office ID:", childData[0]); // Log officeId
    if(childData!=null){
    const sql = `
      SELECT 
        cfs_employee.emp_id,
        cfs_employee.emp_firstname,
        cfs_feedback.feedback_time,
        COUNT(*) AS total_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'Resolved' THEN 1 ELSE 0 END) AS resolved_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'InProgress' THEN 1 ELSE 0 END) AS in_progress_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'Aborted' THEN 1 ELSE 0 END) AS aborted_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'Unassigned' THEN 1 ELSE 0 END) AS unassigned_tickets
      FROM 
        cfs_feedback 
      INNER JOIN 
        cfs_employee ON cfs_feedback.feedback_assigned_to = cfs_employee.emp_id 
      WHERE 
        cfs_feedback.feedback_office = ?  -- Use parameterized query for safety
      GROUP BY 
        cfs_employee.emp_id, cfs_employee.emp_firstname`;

    database.query(sql, [childData[0]], (error, result) => {
      if (error) {
       // console.error("Database query error:", error); // Log the error
        reject(false);
      } else {
       // console.log("Query result:", result); // Log the result
        resolve(result);
      }
    });

  }
  });
};

const filterMyChildOfficeTicketsForReport = async (officeId, startDate, endDate) => {
  [childData] = await getChildOffices(officeId);
  return new Promise((resolve, reject) => {
      // console.log("Child Office ID:", childData[0]); // Log officeId
      if(childData!=null){
    const sql = `
      SELECT 
        cfs_employee.emp_id,
        cfs_employee.emp_firstname,
        cfs_feedback.feedback_time,
        COUNT(*) AS total_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'Resolved' THEN 1 ELSE 0 END) AS resolved_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'InProgress' THEN 1 ELSE 0 END) AS in_progress_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'Aborted' THEN 1 ELSE 0 END) AS aborted_tickets,
        SUM(CASE WHEN cfs_feedback.feedback_status = 'Unassigned' THEN 1 ELSE 0 END) AS unassigned_tickets
      FROM 
        cfs_feedback 
      INNER JOIN 
        cfs_employee ON cfs_feedback.feedback_assigned_to = cfs_employee.emp_id 
      WHERE 
        cfs_feedback.feedback_office = ? 
        AND cfs_feedback.feedback_time BETWEEN ? AND ?  -- Date range filter
      GROUP BY 
        cfs_employee.emp_id, cfs_employee.emp_firstname, cfs_feedback.feedback_time`;

    database.query(sql, [childData[0], startDate, endDate], (error, result) => {
      if (error) {
       // console.error("Database query error:", error);
        reject(false);
      } else {
        //console.log("Query result:", result);
        resolve(result);
      }
    });
  }
  });
};


const setNewMessageTrue = async (tkt_id) => {
  if (typeof Number(tkt_id) === "number") {
    const sql = `UPDATE cfs_feedback SET new_message = 1 WHERE feedback_id = ${tkt_id}`;
    try {
      const result = await database.query(sql);
      return true;
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
};

const setNewMessageFalse = async (tkt_id) => {
  if (typeof Number(tkt_id) === "number") {
    const sql = `UPDATE  cfs_feedback SET new_message = 0 WHERE feedback_id = ${tkt_id}`;
    try {
      const result = await database.query(sql);
      return true;
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
};



const getMyProfile = (emp_id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT cfs_job_title.title_name,cfs_offices.office_name, emp_firstname,emp_middlename,emp_profile_img,emp_phonenumber,emp_email ,
    hierarchy,emp_job_title ,emp_job_level ,emp_job_office ,assigned_requests_amount,emp_status,emp_type FROM cfs_employee LEFT JOIN cfs_offices ON cfs_offices.office_id=cfs_employee.emp_job_office LEFT JOIN cfs_job_title ON cfs_job_title.title_id=cfs_employee.emp_job_title  WHERE emp_id = ${emp_id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        const data = result.map((row) => {
          return [emp_id,
             row.emp_firstname,
            row.emp_middlename,
            row.emp_profile_img,
            row.emp_phonenumber,
            row.emp_email,
            row.hierarchy,
            row.title_name,
            row.emp_job_level,
            row.office_name,
            row.assigned_requests_amount,
            row.emp_status,
            row.emp_type
            ];
        });
        resolve(data);
      }
    });
  }).catch((error) => false);
};
const getChildOffices = (office_id) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT office_id, office_name FROM cfs_offices WHERE office_parent = ${office_id}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        const data = result.map((row) => {
          return [row.office_id, row.office_name];
        });
        resolve(data);
      }
    });
  }).catch((error) => false);
};
const getMineOffice = (empid) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT office_id, office_name FROM cfs_offices INNER JOIN cfs_employee ON cfs_employee.emp_job_office =cfs_offices.office_id WHERE cfs_employee.emp_id = ${empid}`;
    database.query(sql, (error, result) => {
      if (error) {
        reject(false);
      } else {
        const data = result.map((row) => {
          return [row.office_id, row.office_name];
        });
        resolve(data);
      }
    });
  }).catch((error) => false);
};
const setUserOnline = async (emp_id) => {
  if (typeof emp_id === "number") {
    const sql = `UPDATE account SET online = 1 WHERE id = ${emp_id}`;
    try {
      const result = await database.query(sql);
      return true;
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
};
const setOnline = async (userid) => {
  if (typeof userid === "number") {
    const sql = `UPDATE user SET online = 1 WHERE user_id = ${userid}`;
    try {
      const result = await database.query(sql);
      return true;
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
};
const setUserOffline = async (emp_id) => {
  if (typeof emp_id === "number") {
    const sql = `UPDATE account SET online = 0 WHERE id = ${emp_id}`;
    try {
      const result = await database.query(sql);
      return true;
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
};

const setOffline = async (empid) => {
  console.log("logging out...")
  if (typeof empid === "number") {
    const sql = `UPDATE account SET online = 0 WHERE id = ${empid}`;
    try {
      const result = await database.query(sql);
      return true;
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
};

const getOfficeEmployees = async (office_id) => {
  if (typeof office_id === "number") {
    return new Promise((resolve, reject) => {
      const sql = `SELECT emp_id, emp_firstname,emp_middlename FROM cfs_employee WHERE emp_job_office = ${office_id} AND emp_status = 1 `;
      database.query(sql, (error, result) => {
        if (error) {
          reject(false);
        } else {
          const data = result.map(row => [row.emp_id,row.emp_firstname,row.emp_middlename])
          resolve(data)
        }
      });
    });
  } else {
    return false;
  }
};

module.exports = {
  getEmployeeFullName,
  getOfficeName,
  getBranchName,
  getTitleName,
  getLevelName,
  getDefaultOffice,
  getAllTickets,
  getTicketByid,
  updatePassword,
  updateProfile,
  getUserProfile,
  getCategoryTime,
  setNextDeadLine,
  getFeedBackDeadline,
  updateCategory,
  updateBranch,
  updateOffice,
  updateLevel,
  editTitle,
  editAccount,
  deleteCategory,
  deleteLevel,
  deleteOffice,
  deleteTitle,
  deleteBranch,
  deactivateUser,
  activateUser,
  resetPassword,
  getMyExpiredTickets,
  getTicketByIdForExpired,
  getMyExpiryHistory,
  getAttachedFiles,
  getOfficetickets,
  getMyChildOfficetickets,
  getMyChildOfficeTicketsForReport,
  filterMyChildOfficeTicketsForReport,
  analysMyLowOfficetickets,
  analysMyMidOfficetickets,
  analysMyHighOfficetickets,
  getMyLowOfficeTicketsForReport,
  getMyMidOfficeTicketsForReport,
  getMyHighOfficeTicketsForReport,
  filterMyHighOfficeTicketsForReport,
  filterMyMidOfficeTicketsForReport,
  filterMyLowOfficeTicketsForReport,
  getChildOffices,
  getMineOffice,
  getMyProfile,
  setUserOnline,
  setUserOffline,
  setOffline,
  setOnline,
  setNewMessageTrue,
  setNewMessageFalse,
  getOfficeEmployees,
};
