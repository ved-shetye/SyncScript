const express = require("express");
const { signup, signin } = require("../controllers/authController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);

router.get("/profile", protect, (req, res) => {
  res
    .status(200)
    .json({ message: "This is a protected route!", userId: req.user });
});

module.exports = router;
