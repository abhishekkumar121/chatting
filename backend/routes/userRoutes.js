//inside this we are writing all our routes related to user and using this whole file in server.js with end points
//isme jo bhi route bana hai , wo end point ke baad add hoga i.e /api/users/(jo yahan route ka naam hai)

const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").get(protect, allUsers);
router.route("/").post(registerUser);
router.post("/login", authUser);

module.exports = router;
