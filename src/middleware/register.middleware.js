const express = require("express");
const Joi = require("joi");
const Io = require("../utils/Io");
const path = require("path");
const schema = require("../schema/register");
/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports = async (req, res, next) => {
  try {
    const data = req.body;

    const { error, value } = schema.validate(data);
    if (error) {
      throw new Error(error);
    }
    const io = new Io(path.join(__dirname, "..", "model", "users.json"));
    const users = await io.read();
    const find = users.find((e) => e.email == value.email);
    if (find) {
      throw new Error("Users already exist");
    }
    req.users = value;
    next();
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};
