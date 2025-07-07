import express from "express";
const router = express.Router();
import {
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    getUserById,
    deleteUserById,
    updateUserById,
} from '../controllers/userController.js';
import { protect, admin } from "../middleware/authMiddleware.js";

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/logout', logoutUser);
router.post('/auth', authUser);
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/:id').delete(protect, admin, deleteUserById).get(protect, admin, getUserById).put(protect, admin, updateUserById);

export default router;
