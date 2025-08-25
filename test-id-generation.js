// Test script to verify ID generation
const axios = require("axios");

const API_BASE_URL = "http://localhost:3001";

async function testIdGeneration() {
  try {
    console.log("Testing ID generation...");

    // Get current users
    const usersResponse = await axios.get(`${API_BASE_URL}/users`);
    console.log(
      "Current users:",
      usersResponse.data.map((u) => ({
        id: u.id,
        username: u.username || u.email,
      }))
    );

    // Test creating a new user
    const testUser = {
      username: "testuser",
      email: "test@example.com",
      password: "test123",
      fullName: "Test User",
      phone: "1234567890",
      role: "student",
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    console.log("\nCreating test user...");
    const createResponse = await axios.post(`${API_BASE_URL}/users`, testUser);
    console.log("Created user:", createResponse.data);

    // Get users again to see the new ID
    const updatedUsersResponse = await axios.get(`${API_BASE_URL}/users`);
    console.log(
      "\nUpdated users:",
      updatedUsersResponse.data.map((u) => ({
        id: u.id,
        username: u.username || u.email,
      }))
    );

    // Clean up - delete the test user
    console.log("\nCleaning up...");
    await axios.delete(`${API_BASE_URL}/users/${createResponse.data.id}`);
    console.log("Test completed successfully!");
  } catch (error) {
    console.error("Test failed:", error.response?.data || error.message);
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testIdGeneration();
}

module.exports = { testIdGeneration };
