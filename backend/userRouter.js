const express = require("express");
const { registerUser, 
        loginUser, 
        changePassword,
        getAllUsers} = require("./userController.js");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change-password", changePassword);
router.get("/all", getAllUsers);
module.exports = router;
