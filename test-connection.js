// Test both your deployed endpoints
const axios = require("axios");

async function testEndpoints() {
  console.log("Testing backend API...");

  try {
    // Test backend health
    const backendResponse = await axios.get(
      "https://intuitive-insight-production.up.railway.app/api/health"
    );
    console.log("✅ Backend Health:", backendResponse.data);

    // Test backend login endpoint
    const loginResponse = await axios.post(
      "https://intuitive-insight-production.up.railway.app/api/auth/login",
      {
        email: "test@test.com",
        password: "wrongpassword",
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    if (error.response) {
      console.log(
        "✅ Backend login endpoint responding:",
        error.response.status,
        error.response.data
      );
    } else {
      console.log("❌ Backend login endpoint error:", error.message);
    }
  }

  console.log("\nTesting frontend...");

  try {
    // Test frontend
    const frontendResponse = await axios.get(
      "https://bridgeup-platform-z48l.vercel.app"
    );
    console.log("✅ Frontend responding with status:", frontendResponse.status);
  } catch (error) {
    console.log("❌ Frontend error:", error.message);
  }
}

testEndpoints();
