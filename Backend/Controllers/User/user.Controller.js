const { User, Profile, Employee } = require("../../Models/associations.js");
const asyncHandler = require("../../Middleware/asyncHandler.js");
const { validationResult } = require("express-validator");

// ➕ إنشاء مستخدم جديد
exports.createUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, phone, role, profile, employee } = req.body;

  // The Profile model requires Address and DOB.
  if (!profile || !profile.Address || !profile.DOB) {
    res.status(400);
    throw new Error("Profile data (Address and DOB) is required");
  }

  // Create Profile first (assuming references)
  const newProfile = await Profile.create(profile);

  let newEmployee = null;

  // If the role is 'employee', validate and include employee data
  if (role === "employee") {
    if (!employee || !employee.DOH || !employee.salary) {
      res.status(400);
      throw new Error(
        "Employee data (DOH - Date of Hire, and salary) is required for this role",
      );
    }
    newEmployee = await Employee.create(employee);
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role,
    profile: newProfile._id,
    employee: newEmployee ? newEmployee._id : undefined,
  });

  res.status(201).json(user);
});

// 📋 عرض جميع المستخدمين
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).populate("profile").populate("employee");
  res.json(users);
});

// 🧍 عرض مستخدم محدد
exports.getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("profile").populate("employee");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user);
});

// ✏️ تعديل مستخدم
exports.updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, password, phone, role } = req.body;

  const user = await User.findById(id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = name || user.name;
  user.email = email || user.email;
  user.phone = phone || user.phone;
  user.role = role || user.role;

  if (password) {
    user.password = password;
  }

  await user.save();

  // Return the updated user, including profile for display consistency elsewhere
  const updatedUser = await User.findById(id)
    .populate("profile")
    .populate("employee");

  res.json(updatedUser);
});

// 🗑️ حذف مستخدم
exports.deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const deletedUser = await User.findByIdAndDelete(id);

  if (!deletedUser) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({ message: "User deleted successfully" });
});
