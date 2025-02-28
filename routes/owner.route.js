const express = require("express");
const {
  registerOwner,
  loginOwner,
  updateOwnerInfo,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerOwner);
router.post("/login", loginOwner);
router.put("/update", updateOwnerInfo);

module.exports = router;
