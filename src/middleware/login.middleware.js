const express = require("express");
const Io = require("../utils/Io");
const path = require("path");
const validateEmail = require("../utils/validateemail");
/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports = async (req, res, next) => {
  try {
    const io = new Io(path.join(__dirname, "..", "model", "users.json"));
    const users = await io.read();
    const { email, password } = req.body;
    if (email && password) {
      if (validateEmail(email)) {
        const search = users.find((e) => e.email == email);
        if (search) {
          req.users = search;
          next();
          return;
        }
        throw new Error("User not found");
      }
      throw new Error("Email haqiqiy emas");
    }
    throw new Error("email and  password are required");
  } catch (error) {
    res.status(401).json({
      status: 401,
      message: error.message,
    });
  }
};
