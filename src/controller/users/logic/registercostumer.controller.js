const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Io = require("../../../utils/Io");
const path = require("path");
/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 */
module.exports = async (req, res) => {
  try {
    const io = new Io(
      path.join(__dirname, "..", "..", "..", "model", "users.json")
    );
    const users = await io.read();
    const newid = users[users.length - 1]?.id + 1 || 1;
    console.log(newid);
    const { firstName, lastName, email, password } = req.users;
    const hashedPassword = await bcrypt.hash(password, 10);
    io.write({
      id: newid,
      firstName,
      lastName,
      email,
      password: String(hashedPassword),
      role: "customer",
    });
    res.json({
      status: 200,
      message: "Successfully created a new account",
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};
