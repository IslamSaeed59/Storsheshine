const MainPage = require("../../Models/MainPage/MainPage");
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

    const parts = imageUrl.split('/');
    const uploadIndex = parts.indexOf('upload');
    
    if (uploadIndex !== -1) {
      const pathParts = parts.slice(uploadIndex + 2);
      const fullPath = pathParts.join('/'); 
      const lastDot = fullPath.lastIndexOf('.');
      const publicId = lastDot !== -1 ? fullPath.substring(0, lastDot) : fullPath;
      
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (err) {
    console.error("Cloudinary image deletion error:", err);
  }
};

exports.getMainPage = asyncHandler(async (req, res) => {
  const mainPage = await MainPage.findOne();
  if (!mainPage) {
    return res.status(404).json({ message: "MainPage data not found" });
  }
  res.json(mainPage);
});

exports.createMainPage = asyncHandler(async (req, res) => {
  const existing = await MainPage.findOne();
  if (existing) {
    return res.status(400).json({ message: "MainPage data already exists, please update instead" });
  }

  const {
    HeroName,
    HeroImage,
    HeroDescription,
    HeroButton,
    CollectionsName,
    CollectionsDescription,
    OfferName,
    OfferDescription,
    AboutName,
    AboutDescription,
    AboutImage,
  } = req.body;

  const mainPage = await MainPage.create({
    HeroName,
    HeroImage,
    HeroDescription,
    HeroButton,
    CollectionsName,
    CollectionsDescription,
    OfferName,
    OfferDescription,
    AboutName,
    AboutDescription,
    AboutImage,
  });

  res.status(201).json(mainPage);
});

exports.updateMainPage = asyncHandler(async (req, res) => {
  const mainPage = await MainPage.findOne();
  if (!mainPage) {
    return res.status(404).json({ message: "MainPage data not found" });
  }

  const {
    HeroImage,
    AboutImage,
  } = req.body;

  // Handle Cloudinary image deletion for replaced or removed HeroImage
  if (req.body.hasOwnProperty('HeroImage') && Array.isArray(HeroImage)) {
     const newImageUrls = HeroImage.filter(img => typeof img === 'string');
     const imagesToDelete = mainPage.HeroImage.filter(oldImg => !newImageUrls.includes(oldImg));
     
     if (imagesToDelete.length > 0) {
       await Promise.all(imagesToDelete.map(img => deleteFromCloudinary(img)));
     }
  }

  // Handle Cloudinary image deletion for replaced or removed AboutImage
  if (req.body.hasOwnProperty('AboutImage') && Array.isArray(AboutImage)) {
     const newImageUrls = AboutImage.filter(img => typeof img === 'string');
     const imagesToDelete = mainPage.AboutImage.filter(oldImg => !newImageUrls.includes(oldImg));
     
     if (imagesToDelete.length > 0) {
       await Promise.all(imagesToDelete.map(img => deleteFromCloudinary(img)));
     }
  }

  const updatedMainPage = await MainPage.findOneAndUpdate({}, req.body, {
    new: true,
  });

  res.json(updatedMainPage);
});

exports.deleteMainPage = asyncHandler(async (req, res) => {
  const mainPage = await MainPage.findOne();
  if (!mainPage) {
    return res.status(404).json({ message: "MainPage data not found" });
  }

  // Delete all images from Cloudinary
  if (mainPage.HeroImage && mainPage.HeroImage.length > 0) {
     await Promise.all(mainPage.HeroImage.map(img => deleteFromCloudinary(img)));
  }
  if (mainPage.AboutImage && mainPage.AboutImage.length > 0) {
     await Promise.all(mainPage.AboutImage.map(img => deleteFromCloudinary(img)));
  }

  await MainPage.findOneAndDelete();
  res.json({ message: "MainPage data removed" });
});
