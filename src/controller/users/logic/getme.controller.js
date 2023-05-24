const express = require("express");
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
    const me = users.find((e) => e.id == req.userid);
    if (me) {
      res.status(200).json(me);
      return;
    } else {
      throw new Error(true);
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "internal server error",
    });
  }
};
