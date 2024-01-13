const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//protect is made for seeing the authorization
//the below are all the routes or the end points
router.route("/").post(protect, accessChat); //this is for accessing the chat(only logged in user can access the routes)
router.route("/").get(protect, fetchChats); //gets all the chats from the database
router.route("/group").post(protect, createGroupChat); //this routes is for creation of groups
router.route("/rename").put(protect, renameGroup); //for renaming the group
router.route("/groupremove").put(protect, removeFromGroup); //removing from the group
router.route("/groupadd").put(protect, addToGroup); //adding someone in the group

module.exports = router;
