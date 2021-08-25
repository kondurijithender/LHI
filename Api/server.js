const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileUpload = require('express-fileupload');
const dbConfig = require("./app/config/db.config");
const path = require('path');
const app = express();
const apiErrorHandler = require('./app/error/api-error-handler');
var bcrypt = require("bcryptjs");
var corsOptions = {
  origin: "http://localhost:8088"
};

// enable files upload
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, 'public/uploads'),
}));

var dir = path.join(__dirname, 'public');

app.use(express.static(dir));

//app.use(cors(corsOptions));
app.use(cors());
// app.options('*', cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", '*');
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// for parsing application/json
app.use(bodyParser.json());

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));
//form-urlencoded



const db = require("./app/models");
const Role = db.role;
const Brand = db.brand;
const User = db.user;

db.mongoose
   .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
  //.connect(`mongodb+srv://jithender:admin@123@cluster0.ve2xe.mongodb.net/lhi`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });
app.use(function (req, res, next) {
  res.header(
    "Access-Control-Allow-Methods: *",
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});
// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/questionnaire.routes")(app);




app.use(apiErrorHandler);
// set port, listen for requests
const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
 
}
