const express = require("express");
const Joi = require("joi");
const Io = require("../utils/Io");
const path = require("path");
/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports = async (req, res, next) => {
  try {
    const data = req.body;
    const schema = Joi.object({
      firstName: Joi.string().min(1).required(),
      lastName: Joi.string().min(1).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });
    const { error, value } = schema.validate(data);
    if (error) {
      throw new Error(error);
    }
    const io = new Io(path.join(__dirname, "..", "model", "users.json"));
    const users = await io.read();
    const find = users.find((e) => e.id == req.userid);
    if (find.email == value.email) {
      req.users = value;
      next();
      return;
    }
    const emailsearch = users.find((e) => e.email == value.email);
    if (!emailsearch) {
      req.users = value;
      next();
      return;
    }
    throw new Error("email anather user already used");

    // if (find) {
    //   req.users = value;
    //   next();
    //   return;
    // }

    throw new Error("Internal server error");
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};
