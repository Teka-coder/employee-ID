const multer = require('multer');
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const database = require('../../utils/database');
const { insertMessage } = require('../../utils/operationmethods');

// Absolute path for storing files outside the project directory
const UPLOAD_DIR = 'C:/Users/user/OneDrive/Desktop/resources/chat/';
//const UPLOAD_DIR = '/home/btsccffu/resources/chat';  //live absolute resources path
router.post('/', (request, response) => {
  const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        // Ensure the directory exists
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        cb(null, UPLOAD_DIR);
      },
      filename: function (request, file, cb) {
        const uniqueName = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
      }
    }),
    limits: { fileSize: 2000000 },
    fileFilter: function (req, file, cb) {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'), false);
      }
    }
  }).single('file');

  upload(request, response, function (err) {
    if (err instanceof multer.MulterError) {
      return response.status(500).json({ message: 'Multer error: ' + err.message });
    } else if (err) {
      return response.status(500).json({ message: 'File upload error: ' + err.message });
    }

    if (!request.file) {
      return response.status(400).json({ message: 'No file uploaded' });
    }

    // Save relative path to the database
    const relativePath = `resources/chat/${request.file.filename}`;
    const type='image';
    const sql = `INSERT INTO cfs_chat(request_id, sender, internal, office_id, img_src,type) VALUES (?, ?, 1, ?, ?,?)`;

    // Use parameterized query to prevent SQL injection
    database.query(sql, [request.body.id, request.session.emp_id, request.session.userOffice, relativePath,type], (error, result) => {
      if (error) {
        return response.status(500).json({ message: 'Failed to save image in database' });
      }
      console.log("Image uploaded successfully")
      response.status(200).json({ message: 'Image uploaded successfully', path: relativePath });
    });
  });
});

module.exports = router;
