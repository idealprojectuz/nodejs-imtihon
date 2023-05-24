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

    const { role } = req.query;
    if (role) {
      if (role == "admin" || role == "customer") {
        const filteredUser = users.filter((e) => e.role == role);
        res.status(200).json(filteredUser);
        return;
      } else if (role == "superAdmin") {
        res.status(400).json({
          status: 400,
          message: "Super foydalanuvchilarni filterlash mumkin emas",
        });
        return;
      } else {
        res.status(400).json({
          status: 400,
          message: "faqat admin va customer userlarini filterlash mumkin",
        });
        return;
      }
    }
    const filteredUsers = users.filter((e) => e.role != "superAdmin");
    res.status(200).json(filteredUsers);
  } catch (err) {
    res.status(500).json({
      status: 500,
      message: "internal server error",
    });
  }
};
