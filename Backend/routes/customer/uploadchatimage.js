const multer = require("multer");
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const database = require("../../utils/database");
const { insertMessage } = require("../../utils/operationmethods");

const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

// Absolute path for storing files outside the project directory
const UPLOAD_DIR = "C:/Users/user/OneDrive/Desktop/resources/chat/";
//const UPLOAD_DIR = "home/btsccffu/resources/chat";  //live static path
router.post("/", (request, response) => {
  // Set up Multer
  const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        // Create directory if it doesn't exist
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        cb(null, UPLOAD_DIR);
      },
      filename: function (request, file, cb) {
        if (!allowedExtensions.exec(file.originalname)) {
          return cb(new Error("Invalid file type"), false);
        } else {
          cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
          );
        }
      },
    }),
    limits: { fileSize: 2000000 },
    fileFilter: function (req, file, cb) {
      if (file.mimetype.startsWith("image/")) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type"), false);
      }
    },
  }).single("file");

  // Handle the file upload
  upload(request, response, function (err) {
    if (err instanceof multer.MulterError) {
      return response.status(500).json({ message: "Multer error: " + err.message });
    } else if (err) {
      return response.status(500).json({ message: err.message });
    }

    try {
      if (request.file && request.file.filename) {
        const type='image';
        const relativePath = `resources/chat/${request.file.filename}`;
        const sql = `INSERT INTO cfs_chat(request_id, img_src,type) VALUES(?,?,?)`;
        
        // Insert the image path into the database
        database.query(sql, [request.body.id, relativePath,type], (error, result) => {
          if (error) {
            return response.status(500).json({ message: "Failed to save image to database" });
          }
          response.status(200).json({ message: "Image uploaded successfully", path: relativePath });
        });
      } else {
        response.status(400).json({ message: "No file uploaded" });
      }
    } catch (error) {
      response.status(500).json({ message: "Unexpected error: " + error.message });
    }
  });
});

module.exports = router;
