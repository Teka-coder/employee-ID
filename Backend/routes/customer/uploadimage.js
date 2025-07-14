const multer = require("multer");
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const database = require("../../utils/database");

const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

router.post("/", (request, response) => {
  const upload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        // Specify the absolute path for the directory outside the project
        const dir = `C:/Users/user/OneDrive/Desktop/resources/uploads/`;
//    const dir = `/home/btsccffu/resources/uploads`;  // live static path

        fs.mkdirSync(dir, { recursive: true }); // Ensure directory exists or create it
        cb(null, dir);
      },
      filename: function (request, file, cb) {
        if (!allowedExtensions.exec(file.originalname)) {
          return response.status(500).json({ message: "not an image" });
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
        cb(null, false);
        return response.status(500).json({ message: "not an image" });
      }
    },
  }).single("file");

  upload(request, response, function (err) {
    if (err instanceof multer.MulterError) {
      return response.status(500).json(err);
    } else if (err) {
      return response.status(500).json(err);
    }

    // Save the relative path in the database for access via the server
    const directory = `resources/uploads/${request.file.filename}`;
    const sql = `INSERT INTO cfs_chat_image(request_id, img_directory) VALUES(?,?)`;
    database.query(sql, [request.body.id, directory], (error, result) => {
      if (error) {
        response.status(500).json({ message: "failed to upload image" });
      } else {
        response.status(200).json({ message: "image uploaded successfully" });
      }
    });
  });
});

module.exports = router;
