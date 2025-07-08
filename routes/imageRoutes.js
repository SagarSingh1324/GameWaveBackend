import express from "express";
const router = express.Router();
import { getAllImages, getImageById } from '../controllers/imageController.js';

router.route('/').get(getAllImages);
router.route('/:id').get(getImageById);

export default router;
