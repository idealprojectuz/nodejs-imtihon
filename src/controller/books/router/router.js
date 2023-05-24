const express = require("express");
const router = express.Router();
const booksController = require("../logic/bookscrud");
const isLogin = require("../../../middleware/isLogin.middleware");
const isAdmin = require("../../../middleware/isAdmin.middleware");
const checkidMiddleware = require("../../../middleware/checkid.middleware");
router.get("/", isLogin, booksController.Get);
router.get("/:id", isLogin, checkidMiddleware, booksController.GetById);
router.put("/:id", isAdmin, checkidMiddleware, booksController.Edit);
router.delete("/:id", isAdmin, checkidMiddleware, booksController.Delete);
router.post("/", isAdmin, booksController.Add);
module.exports = router;