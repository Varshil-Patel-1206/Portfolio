const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/Admin");

// Register admin
const registerAdmin = async (req, res) => {
  try {
    const {
      username,
      email,
      password,
      setupSecret
    } = req.body;

    // Check setup secret
    if (
      !process.env.ADMIN_SETUP_SECRET ||
      setupSecret !== process.env.ADMIN_SETUP_SECRET
    ) {
      return res.status(403).json({
        message: "Admin registration is disabled"
      });
    }

    // Check required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ email }, { username }]
    });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await Admin.create({
      username,
      email,
      password: hashedPassword
    });

    // Send response
    res.status(201).json({
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
};

// Login admin
const loginAdmin = async (req, res) => {
  try {
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "Authentication is not configured"
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        username: admin.username
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
};

const getCurrentAdmin = (req, res) => {
  res.status(200).json({
    admin: {
      id: req.admin._id,
      username: req.admin.username,
      email: req.admin.email
    }
  });
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getCurrentAdmin
};
