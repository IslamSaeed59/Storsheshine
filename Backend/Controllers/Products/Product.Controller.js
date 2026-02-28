const Product = require("../../Models/Products/Product");
const ProductVariant = require("../../Models/Products/ProductVariant");
const Category = require("../../Models/Products/Category");
const asyncHandler = require("../../Middleware/asyncHandler");

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
  } = req.body;
  console.log(req.body);
  const product = await Product.create({
    name,
    description,
    basePrice,
    categoryId,
    brand,
    images,
  });

  const variant = await ProductVariant.create({
    size,
    color,
    price,
    stock,
    imageVariant,
    productId: product._id,
  });

  res.status(201).json({ product, variant });
});

exports.getProducts = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  // If pagination params are provided, paginate; otherwise return all
  let products;
  let totalProducts;
  let totalPages;
  let currentPage;

  if (page && limit) {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    totalProducts = await Product.countDocuments({});
    totalPages = Math.ceil(totalProducts / limitNum);
    currentPage = pageNum;

    products = await Product.find({})
      .populate("categoryId")
      .skip(skip)
      .limit(limitNum);
  } else {
    // No pagination → return ALL products
    products = await Product.find({}).populate("categoryId");
    totalProducts = products.length;
    totalPages = 1;
    currentPage = 1;
  }

  const productsWithData = await Promise.all(
    products.map(async (product) => {
      const variants = await ProductVariant.find({ productId: product._id });
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

  const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedProduct) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(updatedProduct);
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
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
  const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!updatedCategory) {
    res.status(404);
    throw new Error("Category not found");
  }
  res.json(updatedCategory);
});

exports.deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Category.deleteMany({ parentId: id });
  const deleted = await Category.findByIdAndDelete(id);
  if (!deleted) {
    res.status(404);
    throw new Error("Category not found");
  }
  res.json({ message: "Category removed" });
});

exports.createProductVariant = asyncHandler(async (req, res) => {
  const { productId, size, color, price, stock, imageVariant } = req.body;
  const variant = await ProductVariant.create({
    productId,
    size,
    color,
    price,
    stock,
    imageVariant,
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
  const updatedVariant = await ProductVariant.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!updatedVariant) {
    res.status(404);
    throw new Error("Variant not found");
  }
  res.json(updatedVariant);
});

exports.deleteProductVariant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deleted = await ProductVariant.findByIdAndDelete(id);
  if (!deleted) {
    res.status(404);
    throw new Error("Variant not found");
  }
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
