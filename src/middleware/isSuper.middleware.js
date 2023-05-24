const express = require("express");
const jwt = require("jsonwebtoken");
/**
 *
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
module.exports = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;
    const data = jwt.verify(authorization, process.env.SECRET_KEY);
    if (data.role == "superAdmin") {
      req.role = data.role;
      next();
      return;
    }
    throw new Error();
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
      error: true,
    });
  }
};
