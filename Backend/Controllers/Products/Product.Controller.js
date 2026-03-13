const Product = require("../../Models/Products/Product");
const ProductVariant = require("../../Models/Products/ProductVariant");
const Category = require("../../Models/Products/Category");
const asyncHandler = require("../../Middleware/asyncHandler");

// Helper function to delete images from Cloudinary
const deleteFromCloudinary = async (imageUrl) => {
  if (!imageUrl) return;
  try {
    const cloudinary = require("cloudinary").v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const parts = imageUrl.split("/");
    const uploadIndex = parts.indexOf("upload");

    if (uploadIndex !== -1) {
      const pathParts = parts.slice(uploadIndex + 2);
      const fullPath = pathParts.join("/");
      const lastDot = fullPath.lastIndexOf(".");
      const publicId =
        lastDot !== -1 ? fullPath.substring(0, lastDot) : fullPath;

      await cloudinary.uploader.destroy(publicId);
    }
  } catch (err) {
    console.error("Cloudinary image deletion error:", err);
  }
};

exports.createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    basePrice,
    categoryId,
    brand,
    size,
    color,
    price,
    stock,
    images,
    imageVariant,
    sizeChart,
    discount,
  } = req.body;
  const product = await Product.create({
    name,
    description,
    basePrice,
    categoryId,
    brand,
    images,
    discount,
  });

  const variant = await ProductVariant.create({
    size,
    color,
    price,
    stock,
    imageVariant,
    sizeChart,
    productId: product._id,
  });

  res.status(201).json({ product, variant });
});

exports.getProducts = asyncHandler(async (req, res) => {
  const { page, limit, search, category, subCategories, minPrice, maxPrice } =
    req.query;

  const query = {};
  if (search) {
    const regex = new RegExp(search, "i");
    query.$or = [{ name: regex }, { description: regex }];
  }

  if (category || subCategories) {
    const targetIds = [];
    if (category) targetIds.push(category);
    if (subCategories) {
      targetIds.push(...subCategories.split(","));
    }
    if (targetIds.length > 0) {
      query.categoryId = { $in: targetIds };
    }
  }

  if (minPrice || maxPrice) {
    query.basePrice = {};
    if (minPrice && !isNaN(parseFloat(minPrice)))
      query.basePrice.$gte = parseFloat(minPrice);
    if (maxPrice && !isNaN(parseFloat(maxPrice)))
      query.basePrice.$lte = parseFloat(maxPrice);
  }

  // If pagination params are provided, paginate; otherwise return all
  let products;
  let totalProducts;
  let totalPages;
  let currentPage;

  if (page && limit) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    totalProducts = await Product.countDocuments(query);
    totalPages = Math.ceil(totalProducts / limitNum);
    currentPage = pageNum;

    products = await Product.find(query)
      .select(
        "_id name isBestseller images discount basePrice categoryId createdAt",
      )
      .populate("categoryId", "name parentId")
      .sort({ name: 1 }) // Sort A to Z (ascending)
      .skip(skip)
      .limit(limitNum);
  } else {
    // No pagination → return ALL products sorted A to Z
    products = await Product.find(query)
      .select("_id name isBestseller images discount basePrice categoryId")
      .populate("categoryId", "name parentId")
      .sort({ name: 1 }); // Sort A to Z (ascending)
    totalProducts = products.length;
    totalPages = 1;
    currentPage = 1;
  }

  const productsWithData = await Promise.all(
    products.map(async (product) => {
      const variants = await ProductVariant.find({
        productId: product._id,
      }).select("size");
      const p = product.toObject();
      return {
        ...p,
        Category: p.categoryId,
        ProductVariants: variants,
      };
    }),
  );

  res.json({
    products: productsWithData,
    pagination: {
      totalProducts,
      totalPages,
      currentPage,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    },
  });
});

exports.getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate("categoryId");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const variants = await ProductVariant.find({ productId: id });
  const p = product.toObject();

  res.json({
    ...p,
    Category: p.categoryId,
    ProductVariants: variants,
  });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    basePrice,
    categoryId,
    brand,
    images,
    isBestseller,
    isFeatured,
    discount,
  } = req.body;

  const oldProduct = await Product.findById(id);
  if (!oldProduct) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Handle Cloudinary image deletion for replaced or removed images
  if (req.body.hasOwnProperty("images") && Array.isArray(images)) {
    const newImageUrls = images.filter((img) => typeof img === "string");
    const imagesToDelete = oldProduct.images.filter(
      (oldImg) => !newImageUrls.includes(oldImg),
    );

    if (imagesToDelete.length > 0) {
      await Promise.all(imagesToDelete.map((img) => deleteFromCloudinary(img)));
    }
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.json(updatedProduct);
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Delete all product images from Cloudinary
  if (product.images && product.images.length > 0) {
    await Promise.all(product.images.map((img) => deleteFromCloudinary(img)));
  }

  // Delete all associated variant images from Cloudinary
  const variants = await ProductVariant.find({ productId: id });
  for (const variant of variants) {
    if (variant.imageVariant) await deleteFromCloudinary(variant.imageVariant);
    if (variant.sizeChart) await deleteFromCloudinary(variant.sizeChart);
  }

  await Product.findByIdAndDelete(id);
  await ProductVariant.deleteMany({ productId: id });
  res.json({ message: "Product removed" });
});

exports.CreateCategory = asyncHandler(async (req, res) => {
  const { name, parentId, image } = req.body;
  const category = await Category.create({ name, parentId, image });
  res.status(201).json(category);
});

exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
});

exports.getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  res.json(category);
});

exports.updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const oldCategory = await Category.findById(id);
  if (!oldCategory) {
    res.status(404);
    throw new Error("Category not found");
  }

  // If the image is being changed (or removed entirely), delete the old image from Cloudinary
  if (
    req.body.hasOwnProperty("image") &&
    req.body.image !== oldCategory.image &&
    oldCategory.image
  ) {
    await deleteFromCloudinary(oldCategory.image);
  }

  const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.json(updatedCategory);
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const categoryToDelete = await Category.findById(id);
  if (!categoryToDelete) {
    res.status(404);
    throw new Error("Category not found");
  }

  // Delete associated image from Cloudinary if it exists
  if (categoryToDelete.image) {
    await deleteFromCloudinary(categoryToDelete.image);
  }

  await Category.deleteMany({ parentId: id });
  await Category.findByIdAndDelete(id);

  res.json({ message: "Category removed" });
});

exports.createProductVariant = asyncHandler(async (req, res) => {
  const { productId, size, color, price, stock, imageVariant, sizeChart } =
    req.body;
  const variant = await ProductVariant.create({
    productId,
    size,
    color,
    price,
    stock,
    imageVariant,
    sizeChart,
  });
  res.status(201).json(variant);
});

exports.getProductVariants = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const variants = await ProductVariant.find({ productId });
  res.json(variants);
});

exports.getProductVariantById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const variant = await ProductVariant.findById(id);
  if (!variant) {
    res.status(404);
    throw new Error("Variant not found");
  }
  res.json(variant);
});

exports.updateProductVariant = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const oldVariant = await ProductVariant.findById(id);
  if (!oldVariant) {
    res.status(404);
    throw new Error("Variant not found");
  }

  // Check if imageVariant was updated/removed
  if (
    req.body.hasOwnProperty("imageVariant") &&
    req.body.imageVariant !== oldVariant.imageVariant &&
    oldVariant.imageVariant
  ) {
    await deleteFromCloudinary(oldVariant.imageVariant);
  }

  // Check if sizeChart was updated/removed
  if (
    req.body.hasOwnProperty("sizeChart") &&
    req.body.sizeChart !== oldVariant.sizeChart &&
    oldVariant.sizeChart
  ) {
    await deleteFromCloudinary(oldVariant.sizeChart);
  }

  const updatedVariant = await ProductVariant.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  res.json(updatedVariant);
});

exports.deleteProductVariant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const variant = await ProductVariant.findById(id);

  if (!variant) {
    res.status(404);
    throw new Error("Variant not found");
  }

  if (variant.imageVariant) await deleteFromCloudinary(variant.imageVariant);
  if (variant.sizeChart) await deleteFromCloudinary(variant.sizeChart);

  await ProductVariant.findByIdAndDelete(id);
  res.json({ message: "Variant removed" });
});

exports.searchProducts = asyncHandler(async (req, res) => {
  const { query } = req.query;
  const regex = new RegExp(query, "i");
  const products = await Product.find({
    $or: [{ name: regex }, { description: regex }],
  });
  res.json(products);
});

exports.searchCategories = asyncHandler(async (req, res) => {
  const { query } = req.query;
  const regex = new RegExp(query, "i");
  const categories = await Category.find({
    name: regex,
  });
  res.json(categories);
});

exports.searchProductVariants = asyncHandler(async (req, res) => {
  const { query } = req.query;
  const regex = new RegExp(query, "i");
  const variants = await ProductVariant.find({
    $or: [
      { size: regex },
      { color: regex }, // Works for array of strings too
    ],
  });
  res.json(variants);
});

exports.searchProductsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const products = await Product.find({ categoryId });
  res.json(products);
});

exports.getProductsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const products = await Product.find({ categoryId });

  const productsWithStock = await Promise.all(
    products.map(async (p) => {
      const variants = await ProductVariant.find({ productId: p._id }).select(
        "stock",
      );
      return { ...p.toObject(), ProductVariants: variants };
    }),
  );

  res.json(productsWithStock);
});

exports.getBestsellerProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isBestseller: true })
    .select("_id name isBestseller images discount basePrice categoryId")
    .populate("categoryId", "name parentId")
    .sort({ createdAt: -1 })
    .limit(10); // Optionally limit the amount of featured items returned by default

  const productsWithData = await Promise.all(
    products.map(async (product) => {
      const variants = await ProductVariant.find({
        productId: product._id,
      }).select("size");
      const p = product.toObject();
      return {
        ...p,
        Category: p.categoryId,
        ProductVariants: variants,
      };
    }),
  );

  res.json(productsWithData);
});

exports.getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true })
    .select("_id name isBestseller images discount basePrice categoryId")
    .populate("categoryId", "name parentId")
    .sort({ createdAt: -1 })
    .limit(10);

  const productsWithData = await Promise.all(
    products.map(async (product) => {
      const variants = await ProductVariant.find({
        productId: product._id,
      }).select("size");
      const p = product.toObject();
      return {
        ...p,
        Category: p.categoryId,
        ProductVariants: variants,
      };
    }),
  );

  res.json(productsWithData);
});
