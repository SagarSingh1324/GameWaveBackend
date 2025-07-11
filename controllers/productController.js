import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

// @desc    Fetch all products with optional filtering, search, and pagination
// @route   GET /api/products?brand=Razer&brand=Logitech&category=Mouse&keyword=Aula&pageNumber=2
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const pageSize = Number(process.env.PAGINATION_LIMIT) || 10;
    const page = Number(req.query.pageNumber) || 1;

    let { brand, category, keyword } = req.query;

    const filter = {};

    if (keyword) {
        filter.name = { $regex: keyword, $options: 'i' }; // case-insensitive
    }

    if (brand) {
        if (!Array.isArray(brand)) {
        brand = [brand];
        }
        filter.brand = { $in: brand };
    }

    if (category) {
        if (!Array.isArray(category)) {
        category = [category];
        }
        filter.category = { $in: category };
    }

    const count = await Product.countDocuments(filter);

    const products = await Product.find(filter)
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({
        products,
        page,
        pages: Math.ceil(count / pageSize),
    });
});

// @desc Fetch a single product by ID
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        return res.status(200).json(product);
    } else {
        res.status(404);
        throw new Error('Resource not found');
    }
});

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(6);

  res.json(products);
});

export { 
    getProducts, 
    getProductById,
    getTopProducts,
 };
