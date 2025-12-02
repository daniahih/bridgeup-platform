const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

// Google OAuth Strategy
if (
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_ID !== "placeholder_google_client_id"
) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL:
          process.env.NODE_ENV === "production"
            ? "https://intuitive-insight-production.up.railway.app/api/auth/google/callback"
            : `http://localhost:${
                process.env.PORT || 5000
              }/api/auth/google/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({
            $or: [{ googleId: profile.id }, { email: profile.emails[0].value }],
          });

          if (user) {
            // Update Google ID if not set
            if (!user.googleId) {
              user.googleId = profile.id;
              await user.save();
            }
            return done(null, user);
          }

          // Create new user - default to student role
          const role = "student";
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            role: role,
            track: "Fullstack", // Default track for students
            profilePicture: profile.photos[0]?.value,
            isVerified: true,
          });

          await user.save();
          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

// GitHub OAuth Strategy
if (
  process.env.GITHUB_CLIENT_ID &&
  process.env.GITHUB_CLIENT_ID !== "placeholder_github_client_id"
) {
  const GitHubStrategy = require("passport-github2").Strategy;

  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL:
          process.env.NODE_ENV === "production"
            ? "https://intuitive-insight-production.up.railway.app/api/auth/github/callback"
            : `http://localhost:${
                process.env.PORT || 5000
              }/api/auth/github/callback`,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({
            $or: [
              { githubId: profile.id },
              { email: profile.emails?.[0]?.value },
            ],
          });

          if (user) {
            // Update GitHub ID if not set
            if (!user.githubId) {
              user.githubId = profile.id;
              await user.save();
            }
            return done(null, user);
          }

          // Create new user
          const role = profile.state || "student"; // Get role from state parameter
          user = new User({
            name: profile.displayName || profile.username,
            email:
              profile.emails?.[0]?.value || `${profile.username}@github.local`,
            githubId: profile.id,
            role: role,
            profilePicture: profile.photos?.[0]?.value,
            isVerified: true,
            track: role === "student" ? "Fullstack" : undefined,
            companyName:
              role === "company" ? profile.company || "GitHub User" : undefined,
          });

          await user.save();
          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
}

// Basic passport serialization (required even without strategies)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
