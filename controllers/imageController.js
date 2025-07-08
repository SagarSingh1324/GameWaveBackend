import asyncHandler from "../middleware/asyncHandler.js";
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IMAGES_DIRECTORY = path.join(__dirname, '../data/images');
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

/**
 * Get all images
 * GET /images
 */
const getAllImages = asyncHandler(async (req, res) => {
    // Read the images directory
    const files = await fs.readdir(IMAGES_DIRECTORY);
   
    // Filter only image files
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ALLOWED_EXTENSIONS.includes(ext);
    });
    
    const images = await Promise.all(
      imageFiles.map(async (filename) => {
        const filePath = path.join(IMAGES_DIRECTORY, filename);
        const stats = await fs.stat(filePath);
       
        return {
          id: filename, // Full filename including extension
          filename: filename,
          size: stats.size,
          lastModified: stats.mtime,
          url: `/images/${filename}` // URL includes extension
        };
      })
    );
    
    res.status(200).json({
      success: true,
      count: images.length,
      data: images
    });
});

/**
 * Get image by ID (with extension)
 * GET /images/:id
 */
const getImageById = asyncHandler(async (req, res) => {
  const { id } = req.params;
 
  // Check if the requested file has a valid extension
  const ext = path.extname(id).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return res.status(400).send('Invalid image format');
  }

  // Check if file exists in the images directory
  const filePath = path.join(IMAGES_DIRECTORY, id);
  
  try {
    await fs.access(filePath);
    res.sendFile(filePath);
  } catch (error) {
    return res.status(404).send('Image not found');
  }
});

export {
  getAllImages,
  getImageById,
};