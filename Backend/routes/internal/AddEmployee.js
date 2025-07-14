const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');
const database = require('../../utils/database');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const session = require('express-session');

// Set up multer storage
const weburl = 'https://qrapp.btsc-cfs.com/employee';

// Local static path
const uploadedemployee = `C:/Users/user/OneDrive/Desktop/resources/employee`;
const generatedemployee = `C:/Users/user/OneDrive/Desktop/resources/employeeqrpic`;

// Live static path
// const uploadedemployee = `/home/btsccffu/resources/employee`;
// const generatedemployee = `/home/btsccffu/resources/employeeqrpic`;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadedemployee); // Save uploaded images in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname)); // Unique filename with original extension
  },
});
const upload = multer({ storage: storage });

const validateEmployeeName = (name) => {
  const regex = /^[A-Za-z\s]+$/; // Allow only letters and spaces
  return regex.test(name);
};

// Route to add employee
router.post('/', upload.single('emp_picture'), async (request, response) => {
  console.log('I begin to add..');
  const by = request.session.loggeduser;
  console.log('by ' + by);

  const {
    emp_fullname,
    emp_position,
    issued_date,
    staff_uniqueid,
    emp_phone,
    employed_date,
  } = request.body;

  const emp_picture = request.file ? `${request.file.filename}` : ''; // Get the file path if uploaded
  console.log('sent ' + emp_fullname + ' ' + staff_uniqueid);

  // Validate employee name
  if (!validateEmployeeName(emp_fullname)) {
    return response.status(400).json({ message: 'Invalid employee name' });
  }

  // Generate unique filename for QR code
  const qrid = uuidv4();
  const qr_filename = emp_fullname + '.png'; // Unique filename for each QR code

  // Generate QR code URL
  const qr_encode = `${weburl}/${qrid}`;

  // Prepare the relative path for the QR code image
  const qr_picture = `${qr_filename}`;

  const qr_path = path.join(path.resolve(generatedemployee), qr_filename); // Save in the 'static' folder outside the project

  // Check if the trackid already exists
  database.query(
    'SELECT * FROM employee WHERE emptrack_id = ? || staff_uniqueid = ?',
    [qrid, staff_uniqueid],
    (error, results) => {
      if (error) {
        console.error('Error checking for duplicate employee:', error);
        return response.status(500).json({ message: 'Database error' });
      }

      if (results.length > 0) {
        console.log('Emp Track ID ' + qrid + ' is already generated or'+ staff_uniqueid + ' is already used');
        return response.status(400).json({ message: 'Duplicated' });
      }

      // Generate QR code and save as PNG file
      QRCode.toFile(qr_path, qr_encode, (err) => {
        if (err) {
          console.log('error happened ' + err);
          return response.status(501).json({ message: 'Error generating QR code' });
        }

        // Parameterized query to insert employee data into the database
        const sql = `
          INSERT INTO employee (emp_fullname, emptrack_id, staff_uniqueid, qr_encode, qr_picture, inserted_by)
          VALUES (?, ?, ?, ?, ?, ?)`;

        const values = [emp_fullname, qrid, staff_uniqueid, qr_encode, qr_picture, by];

        // Insert employee into the database
        database.query(sql, values, (error, result) => {
          if (error) {
            console.log('Failed to insert');
            return response.status(500).json({ message: 'Failed to insert employee' });
          } else {
            console.log('Successful');
            response.status(200).json({ message: 'Employee added successfully', recentEmployee: result });
          }
        });
      });
    }
  );
});

module.exports = router;