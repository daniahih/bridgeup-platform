const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // Common fields for all users
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId && !this.githubId;
      },
      minlength: [6, "Password must be at least 6 characters"],
    },

    // OAuth fields
    googleId: {
      type: String,
      sparse: true,
    },
    githubId: {
      type: String,
      sparse: true,
    },
    profilePicture: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["student", "company", "admin"],
      required: true,
    },

    // Student-specific fields
    track: {
      type: String,
      enum: ["Fullstack", "QA", "Data", "DevOps", "Cyber Security"],
      required: function () {
        return this.role === "student";
      },
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    github: {
      type: String,
      trim: true,
    },
    linkedin: {
      type: String,
      trim: true,
    },

    // Company-specific fields
    companyName: {
      type: String,
      trim: true,
      required: function () {
        return this.role === "company";
      },
    },
    industry: {
      type: String,
      trim: true,
    },
    companyDescription: {
      type: String,
      trim: true,
      maxlength: [1000, "Company description cannot exceed 1000 characters"],
    },

    // Profile completion and verification
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },

    // Timestamps
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) {
    return false; // OAuth users don't have passwords
  }
  return bcrypt.compare(candidatePassword, this.password);
};

// Calculate profile completion percentage
userSchema.methods.calculateProfileCompletion = function () {
  let completed = 0;
  let total = 0;

  if (this.role === "student") {
    total = 7; // name, email, track, skills, github, linkedin, description
    if (this.name) completed++;
    if (this.email) completed++;
    if (this.track) completed++;
    if (this.skills && this.skills.length > 0) completed++;
    if (this.github) completed++;
    if (this.linkedin) completed++;
  } else if (this.role === "company") {
    total = 5; // name, email, companyName, industry, description
    if (this.name) completed++;
    if (this.email) completed++;
    if (this.companyName) completed++;
    if (this.industry) completed++;
    if (this.companyDescription) completed++;
  }

  return Math.round((completed / total) * 100);
};

module.exports = mongoose.model("User", userSchema);
