// routes/upload.js

const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const router = express.Router();

/* ==============================
   🔥 Cloudinary Config
============================== */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ==============================
   📦 Multer (Memory Storage)
============================== */

const parser = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"), false);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/* ==============================
   🚀 Upload Helper
============================== */

const uploadToCloudinary = (fileBuffer, folder, publicId) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

/* ==============================
   🖼 Upload Variant Image
============================== */

router.post(
  "/variantImage",
  parser.single("variantImage"),
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: "Please upload a file." });

      const categoryName = req.body.categoryName
        ? req.body.categoryName
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9-]/g, "")
        : "uncategorized";

      const folder = `ecommerce/products/${categoryName}`;
      const publicId = `variant-${Date.now()}`;

      const result = await uploadToCloudinary(
        req.file.buffer,
        folder,
        publicId,
      );

      res.status(200).json({
        message: "Variant image uploaded successfully",
        imageUrl: result.secure_url,
        public_id: result.public_id,
      });
    } catch (error) {
      console.error("❌ Variant Upload error:", error);
      res.status(500).json({ message: error.message });
    }
  },
);

/* ==============================
   📂 Upload Category Image
============================== */

router.post("/categories", parser.single("categoryImage"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Please upload a file." });

    const categoryName = req.body.categoryName
      ? req.body.categoryName
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
      : "uncategorized";

    const folder = `ecommerce/categories/${categoryName}`;
    const publicId = `category-${Date.now()}`;

    const result = await uploadToCloudinary(req.file.buffer, folder, publicId);

    res.status(200).json({
      message: "Category image uploaded successfully",
      imageUrl: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("❌ Category Upload error:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ==============================
   📦 Upload Product Image
============================== */

router.post("/", parser.single("productImage"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Please upload a file." });

    const categoryName = req.body.categoryName
      ? req.body.categoryName
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
      : "uncategorized";

    const folder = `ecommerce/products/${categoryName}`;
    const publicId = `product-${Date.now()}`;

    const result = await uploadToCloudinary(req.file.buffer, folder, publicId);

    res.status(200).json({
      message: "Product image uploaded successfully",
      imageUrl: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("❌ Product Upload error:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ==============================
   ⚠️ Error Handler
============================== */

router.use((err, req, res, next) => {
  console.error("❌ Multer Error:", err);
  res.status(400).json({ message: err.message });
});

/* ==============================
   🧪 Test Route
============================== */

router.post("/test123", (req, res) => {
  res.json({ ok: true });
});

module.exports = router;
