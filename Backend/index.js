require("dotenv").config();
const cors = require("cors");
const express = require("express");
const session = require("express-session");
const database = require("./utils/database");
const checkSession = require("./middlewares/checksession");
const mysqlStore = require("express-mysql-session")(session);
const path = require('path');

const options = {
  connectionLimit: 30,
  password: "1234",
  user: "root",
  database: "btsccffu_emp_profile",
  host: "localhost",
  createDatabaseTable: true,
};

const sessionStore = new mysqlStore(options);
const app = express();

// app.use(cors());
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "http://localhost:5174","http://192.168.100.225:5173/"],
//     credentials: true,
//   })
// );

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true, // Prevent JavaScript access to the session cookie
      secure: false,  // Set to `true` in production with HTTPS
      maxAge: 1000 * 60 * 60 * 24,  // 1 day expiration
    }
  })
);

// app.use(session({
//   secret: 'your-secret-key', // Set your session secret
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     secure: false, // Change to true in production with HTTPS
//     httpOnly: true,
//   }
// }));


app.use(
  cors({
    origin: [
      process.env.LOCAL_CLIENT1,
      process.env.LOCAL_CLIENT2,
      
    ],
    credentials: true,
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// app.use(
//   cors({
//     origin: [
//       process.env.LIVE_CLIENT1,
//       process.env.LIVE_CLIENT2,
//       process.env.LIVE_CLIENT3
      
//     ],
//     credentials: true,
//     methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
app.use(express.json());

// const fileDirectory = path.join(__dirname, 'C:/Users/user/OneDrive/Desktop/resources/chat');
// // Serve static files from an external directory
// app.use('/resources/chat',checkSession, express.static(fileDirectory));


// Serve static files from the public directory
const fileDirectory = 'C:/Users/user/OneDrive/Desktop/resources';
//const fileDirectory = '/home/btsccffu/resources';   //live static path
app.use('/static', express.static(fileDirectory));



// Import Routers
const employee = require("./routes/employeeprofile");
const trackemployeeprofile = require("./routes/trackemployeeprofile");
const addEmployee = require("./routes/internal/AddEmployee");
const authenticate = require("./routes/customer/authenticate");
const getUserStats = require("./routes/internal/getuserstat");
const userlogout = require("./routes/customer/userlogout");

app.get("/test", (req, res) => {
  res.status(200).json({ message: "working successfully" });
});

app.use("/employee", employee);
app.use("/trackemployeeprofile", trackemployeeprofile);
app.use("/addemp", checkSession, addEmployee);
app.use("/authenticate", authenticate);  //customer/user login api
app.use("/userstat", getUserStats);
app.use("/userlogout", userlogout);


app.listen(process.env.PORT, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log(`App is running on Port: ${process.env.PORT}`);
});
