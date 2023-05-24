const express = require("express");
const bcrypt = require("bcrypt");
const Io = require("../../../utils/Io");
const path = require("path");
/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
module.exports = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.users;

    const io = new Io(
      path.join(__dirname, "..", "..", "..", "model", "users.json")
    );
    const users = await io.read();
    const me = users.find((e) => e.id == req.userid);
    me.firstName = firstName;
    me.lastName = lastName;
    me.email = email;
    me.password = await bcrypt.hash(password, 10);
    io.edit(users);
    res.json({
      status: 200,
      message: "edit successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "internal server error",
    });
  }
};
