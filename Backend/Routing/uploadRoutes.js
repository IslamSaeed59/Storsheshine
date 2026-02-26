// routes/upload.js
const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

const router = express.Router();

// ⚡ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ⚡ Configure Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const categoryName = req.body.categoryName
      ? req.body.categoryName
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
      : "uncategorized";

    // Different folder for products vs categories
    const folder = req.originalUrl.includes("categories")
      ? `ecommerce/categories/${categoryName}`
      : `ecommerce/products/${categoryName}`;

    return {
      folder,
      allowed_formats: ["jpg", "jpeg", "png"],
      public_id: `${file.fieldname}-${Date.now()}`, // unique filename
    };
  },
});

const parser = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Not an image! Please upload only images."), false);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ✅ Upload Product Image
router.post("/", parser.single("productImage"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Please upload a file." });

    const categoryName = req.body.categoryName || "uncategorized";

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: req.file.path, // Cloudinary URL
      category: categoryName,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ✅ Upload Category Image
router.post("/categories", parser.single("categoryImage"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Please upload a file." });

    const categoryName = req.body.categoryName || "uncategorized";

    res.status(200).json({
      message: "Category image uploaded successfully",
      imageUrl: req.file.path,
      category: categoryName,
      filename: req.file.filename,
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ⚡ Multer error handler
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("❌ Multer error:", err);
    return res.status(400).json({ message: `Multer error: ${err.message}` });
  }
  if (err) {
    console.error("❌ Error:", err);
    return res.status(400).json({ message: err.message });
  }
  next();
});

module.exports = router;
