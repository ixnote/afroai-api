const db = require("../models");
const asyncHandler = require("./async");
const Login = db.Login;

const checkDuplicateEmail = asyncHandler(async (req, res, next) => {
  // Email
  db.Users.findOne({
    where: {
      email: req.body.email,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        success: false,
        message: "Email is already in use!",
      });
      return;
    }

    next();
  });
});

const checkDuplicatePhone = asyncHandler(async (req, res, next) => {
  //phonenumber
  try {
    if (req.body.phone) {
      const { phone } = req.body;
      const phoneNo = "+234" + phone.slice(1);
      //const table = type.charAt(0).toUpperCase() + type.slice(1);
      const user = await db.Users.findOne({
        where: {
          phone: phoneNo,
        },
      });
      if (user) {
        res.status(400).send({
          success: false,
          message: "Phone number is already exists!",
        });
        return;
      }
    }
    next();
  } catch (err) {
    console.log(err);
  }
});

const checkDuplicateUsername = asyncHandler(async (req, res, next) => {
  // Email
  db.Users.findOne({
    where: {
      username: req.body.username,
    },
  }).then((user) => {
    if (user) {
      res.status(400).send({
        success: false,
        message: "Username is already in use!",
      });
      return;
    }

    next();
  });
});

// checkRolesExisted = (req, res, next) => {
//   if (req.body.roles) {
//     for (let i = 0; i < req.body.roles.length; i++) {
//       if (!Roles.includes(req.body.roles[i])) {
//         res.status(400).send({
//           message: "Failed! Role does not exist = " + req.body.roles[i]
//         });
//         return;
//       }
//     }
//   }

//   next();
// };

const verify = {
  checkDuplicateEmail: checkDuplicateEmail,
  checkDuplicatePhone: checkDuplicatePhone,
  checkDuplicateUsername: checkDuplicateUsername,
  //   checkRolesExisted: checkRolesExisted
};

module.exports = verify;
