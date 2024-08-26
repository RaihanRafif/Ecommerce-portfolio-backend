// controllers/userController.js
const { User } = require('../models'); // Import the User model

// Create a new user
exports.createUser = async (req, res) => {
    try {
        console.log("TESS", req.body);

        const { firstName, lastName, email, password, isAdmin } = req.body;
        // Create a new user
        const user = await User.create({ firstName, lastName, email, password, isAdmin });
        res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// // Get all users
// export const getAllUsers = async (req, res) => {
//     try {
//         const users = await User.findAll();
//         res.status(200).json(users);
//     } catch (error) {
//         console.error('Error fetching users:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };

// // Get a single user by ID
// export const getUserById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const user = await User.findByPk(id);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         res.status(200).json(user);
//     } catch (error) {
//         console.error('Error fetching user:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };

// // Update a user by ID
// export const updateUser = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { firstName, lastName, email, password, isAdmin } = req.body;

//         const user = await User.findByPk(id);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         // Update user details
//         await user.update({ firstName, lastName, email, password, isAdmin });
//         res.status(200).json(user);
//     } catch (error) {
//         console.error('Error updating user:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };

// // Delete a user by ID
// export const deleteUser = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const user = await User.findByPk(id);

//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         await user.destroy();
//         res.status(204).json(); // No content
//     } catch (error) {
//         console.error('Error deleting user:', error);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// };
