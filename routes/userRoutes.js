// routes/userRoutes.js
const express = require("express");
const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require("../controllers/userController");
const router = express.Router();

// Define routes for user operations
router.post('/users', createUser);
// router.get('/users', getAllUsers);
// router.get('/users/:id', getUserById);
// router.put('/users/:id', updateUser);
// router.delete('/users/:id', deleteUser);

module.exports = router
