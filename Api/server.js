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
  //  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
  .connect(`mongodb+srv://jithender:admin@123@cluster0.ve2xe.mongodb.net/agrisoft`, {
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
require("./app/routes/user.routes")(app);
require("./app/routes/brands.routes")(app);
require("./app/routes/product.routes")(app);
require("./app/routes/warehouse.routes")(app);
require("./app/routes/route.routes")(app);
require("./app/routes/distributor.routes")(app);
require("./app/routes/order.routes")(app);
require("./app/routes/notifications.routes")(app);
require("./app/routes/delveryboy.routes")(app);




app.use(apiErrorHandler);
// set port, listen for requests
const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "distributor"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Distributor' to roles collection");
      });

      new Role({
        name: "delivery-boy"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Delivery Boy' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
      new Role({
        name: "brand-admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'brand admin' to roles collection");
      });
    }
  });
  Brand.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Brand({
        name: "Sabari Milk",
        image: `brands/sabari.jpg`
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Sabari Milk' to Brand collection");
      });

      new Brand({
        name: "Menma Milk",
        image: `brands/menma.png`
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Menma Milk' to Brand collection");
      });

      new Brand({
        name: "Malabar Milk",
        image: `brands/malabar.png`
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'Malabar Milk' to Brand collection");
      });
    }
  });
  User.estimatedDocumentCount((err, count) => {
    if (!err) {
      let newPassword = 'admin';
      Role.findOne({
        name: 'admin'
      })
        .exec((err, role) => {
          if (role) {
            console.log(role);
            if (role.length === 0) {
              bcrypt.genSalt(10, function (err, salt) {
                // Call error-handling middleware:
                if (err) { return res.send({ error: true, message: err }); }
                bcrypt.hash(newPassword, salt, function (err, hash) {
                  new User({
                    name: "admin",
                    username: "admin",
                    email: "admin@yopmail.com",
                    password: hash,
                    roles: role._id
                  }).save(err => {
                    if (err) {
                      console.log("error", err);
                    }
                  })
                });
              })
            }
          }
        })
    }
  });
}
