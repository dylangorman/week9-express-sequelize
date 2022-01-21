const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

// get all users
router.get("/", async (req, res) => {
  const allUsers = await User.findAll();
  attributes: ["id", "name", "createdAt", "updatedAt"],
    res.status(200).json({ msg: "All Users", data: allUsers });
});

// create a user
router.post("/", async (req, res) => {
  const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS));
  const password = await bcrypt.hash(req.body.password, salt);
  const newUser = await User.create({
    name: req.body.name,
    password,
  });
  res.status(201).json({ msg: "Created New User", data: newUser });
});

// delete all users
router.delete("/", async (req, res) => {
  const allUsers = await User.destroy({
    where: {},
    truncate: false,
  });
  res.status(201).json({ msg: "Deleted All Users", data: allUsers });
});

// get a single user
router.get("/:id", async (req, res) => {
  const user = await User.findOne({
    where: { id: req.params.id },
  });
  res.status(201).json({ msg: "Display Requested User", data: user });
});

// update a single user
router.put("/:id", async (req, res) => {
  const updateUser = await User.update(
    { name: req.body.name },
    {
      where: { id: req.params.id },
    }
  );
  res.status(200).json({ msg: "User Updated Successfully", data: updateUser });
});

// delete a single user
router.delete("/:id", async (req, res) => {
  const deleteUser = await User.destroy({
    where: { id: req.params.id },
  });
  res.status(201).json({ msg: "Delete User", data: deleteUser });
});
module.exports = router;
