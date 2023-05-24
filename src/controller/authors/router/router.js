const express = require("express");
const router = express.Router();
const authorController = require("../logic/author.controller");
const isLogin = require("../../../middleware/isLogin.middleware");
const isAdmin = require("../../../middleware/isAdmin.middleware");
const checkId = require("../../../middleware/checkid.middleware");
router.get("/", isLogin, authorController.Get);
router.get("/:id", isLogin, checkId, authorController.GetById);
router.put("/:id", isAdmin, checkId, authorController.Edit);
router.post("/", isAdmin, authorController.Add);
router.delete("/:id", isAdmin, checkId, authorController.Delete);

module.exports = router;
