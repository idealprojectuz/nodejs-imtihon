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
    const { id } = req.params;
    if (id != req.userid) {
      const io = new Io(
        path.join(__dirname, "..", "..", "..", "model", "users.json")
      );
      const users = await io.read();
      const search = users.find((e) => e.id == id);
      if (search) {
        const filters = users.filter((e) => e.id != search.id);
        await io.edit(filters);
        res.json({ status: 200, message: "Delete completed" });
        return;
      }
      throw new Error("User not found");
    }
    throw new Error("Siz o'zingizni o'chira olmaysiz");
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};
