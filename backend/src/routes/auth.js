const express = require("express");
const { body } = require("express-validator");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { auth } = require("../middleware/auth");
const {
  register,
  login,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

const router = express.Router();

// Validation rules
const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),

  body("role")
    .isIn(["student", "company", "admin"])
    .withMessage("Role must be student, company, or admin"),

  // Conditional validation for student track
  body("track")
    .if(body("role").equals("student"))
    .isIn(["Fullstack", "QA", "Data", "DevOps", "Cyber Security"])
    .withMessage("Invalid track for student"),

  // Conditional validation for company name
  body("companyName")
    .if(body("role").equals("company"))
    .trim()
    .notEmpty()
    .withMessage("Company name is required for company accounts"),
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),

  body("password").notEmpty().withMessage("Password is required"),

  body("role")
    .isIn(["student", "company", "admin"])
    .withMessage("Role must be student, company, or admin"),
];

const updateProfileValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("skills").optional().isArray().withMessage("Skills must be an array"),

  body("github").optional().isURL().withMessage("GitHub must be a valid URL"),

  body("linkedin")
    .optional()
    .isURL()
    .withMessage("LinkedIn must be a valid URL"),
];

// OAuth helper function
const handleOAuthSuccess = (req, res) => {
  try {
    const user = req.user;

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Redirect to frontend with success
    const baseUrl = process.env.CLIENT_URL || "http://localhost:3000";
    const redirectUrl = `${baseUrl}/auth-success?token=${encodeURIComponent(
      token
    )}`;
    console.log("OAuth redirect URL:", redirectUrl);
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("OAuth success handler error:", error);
    const baseUrl = process.env.CLIENT_URL || "http://localhost:3000";
    res.redirect(`${baseUrl}/login?error=oauth_failed`);
  }
};

// Routes
router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfileValidation, updateProfile);

// Google OAuth routes
router.get("/google", (req, res, next) => {
  const { role } = req.query;
  const state = role || "student";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: state,
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=google_auth_failed`,
  }),
  handleOAuthSuccess
);

// GitHub OAuth routes
router.get("/github", (req, res, next) => {
  const { role } = req.query;
  const state = role || "student";
  passport.authenticate("github", {
    scope: ["user:email"],
    state: state,
  })(req, res, next);
});

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=github_auth_failed`,
  }),
  handleOAuthSuccess
);

module.exports = router;
