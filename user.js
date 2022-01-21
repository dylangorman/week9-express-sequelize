const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
// const hash = require("../hash.js");
// const JwtStrategy = require("passport-jwt/lib/strategy");
const saltRounds = parseInt(process.env.SALT_ROUNDS);

const session = { session: false };
////////////////////////////////////////////////////;
// const bcrypt = require("bcrypt");

const profile = (req, res, next) => {
  res.status(200).json({
    message: "profile",
    user: req.user,
    token: req.query.secret_token,
  });
};
router.get("/", passport.authenticate("jwt", session), profile);

//////////////////////////register user//////////////
//takes the authenticated req and returns a response

const register = async (req, res, next) => {
  try {
    req.user.name
      ? res.status(201).json({ msg: "user registered", user: req.user })
      : res.status(401).json({ msg: "User already exists" });
  } catch (error) {
    next(error);
  }
};

//localhost/user/registeruser
//register router - authenticate using registerStrategy (names 'register) and passes on the register function defined above

router.post(
  "/registeruser",
  passport.authenticate("register", session),
  register
);
////////////////// login ///////////////////
const login = async (req, res, next) => {
  passport.authenticate("login", (error, user) => {
    try {
      if (error) {
        res.status(500).json({ msg: "Internal Server Error" });
      } else if (!user) {
        res.status(401).json(info);
      } else {
        const loginFn = (error) => {
          if (error) {
            return next(error);
          } else {
            const userData = { id: user.id, name: user.name };
            const data = {
              user,
              token: jwt.sign({ user: userData }, process.env.SECRET_KEY),
            };
            res.status(200).json(data);
          }
        };
        req.login(user, session, loginFn);
      }
    } catch (error) {
      return next(error);
    }
  })(req, res, next); //IFFY - immediately invoked Fucntion Expression
};
router.post("/userlogin", login);

////////////////////////routes//////////////////////////////////////
// get all users
// router.get("/getallusers", async (req, res) => {
//   const allUsers = await User.findAll({
//     attributes: ["id", "name"],
//   });
//   res.status(200).json({ msg: "worked", data: allUsers });
// });
router.get("/getallusers", async (req, res) => {
  const allUsers = await User.findAll();
  attributes: ["id", "name", "createdAt", "updatedAt"],
    res.status(200).json({ msg: "All Users", data: allUsers });
});

// delete all users
// router.delete("/deleteallusers", async (req, res) => {
//   const deletedUser = await User.destroy({ where: {} });
//   console.log(deletedUser);
//   res.status(200).json({ msg: `Deleted ${deletedUser}` });
// });
router.delete("/deleteallusers", async (req, res) => {
  const deletedUser = await User.destroy({
    where: {},
    truncate: true,
  });
  res.status(201).json({ msg: `Deleted All Users, ${deletedUser}` });
});

// get a single user
// router.get("/:id", async (req, res) => {
//   const user = await User.findOne({ where: { id: req.params.id } });
//   res.status(200).json({ msg: user });
// });
router.get("/:id", async (req, res) => {
  const user = await User.findOne({
    where: { id: req.params.id },
  });
  res.status(201).json({ msg: "Display Requested User", data: user });
});

// update a single user
// router.put("/:id", async (req, res) => {
//   const updatedUser = await User.update(
//     { name: req.body.newName },
//     { where: { id: req.params.id } }
//   );
//   const user = await User.findOne({ where: { id: req.params.id } });
//   res.status(200).json({ msg: updatedUser });
// });
router.put("/:id", async (req, res) => {
  const updateUser = await User.update(
    { name: req.body.name },
    {
      where: { id: req.params.id },
    }
  );
  res
    .status(200)
    .json({ msg: `User Updated Successfully", data: ${updateUser}` });
});

// delete a single user
// router.delete("/:id", async (req, res) => {
//   const user = await User.findOne({ where: { id: req.params.id } });
//   const deletedUser = await user.destroy();
//   console.log(deletedUser);
//   res.status(200).json({ msg: deletedUser });
// });
router.delete("/:id", async (req, res) => {
  const deleteUser = await User.destroy({
    where: { id: req.params.id },
  });
  res.status(201).json({ msg: "Delete User", data: deleteUser });
});
module.exports = router;
