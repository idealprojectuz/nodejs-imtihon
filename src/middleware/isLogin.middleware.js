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
    req.userid = data.id;
    req.role = data.role;
    next();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
      error: true,
    });
  }
};
