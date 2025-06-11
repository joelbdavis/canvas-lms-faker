// Usage: node canvas-fake-data.js
// Requires: npm install axios @faker-js/faker dotenv

require("dotenv").config();
const axios = require("axios");
const { faker } = require("@faker-js/faker");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const { createUser, createCourse } = require("./canvasApi");
const { generateFakeUser, generateFakeCourse } = require("./fakeData");

// Parse CLI options for number of users and courses
const argv = yargs(hideBin(process.argv))
  .option("users", {
    alias: "u",
    type: "number",
    description: "Number of fake users to create",
    default: 5,
  })
  .option("courses", {
    alias: "c",
    type: "number",
    description: "Number of fake courses to create",
    default: 2,
  })
  .help().argv;

// === CONFIGURATION ===
const CANVAS_URL = process.env.CANVAS_URL || "http://localhost:8080/api/v1";
const ACCESS_TOKEN = process.env.CANVAS_TOKEN || "YOUR_ADMIN_TOKEN_HERE";

const NUM_USERS = argv.users;
const NUM_COURSES = argv.courses;

const api = axios.create({
  baseURL: CANVAS_URL,
  headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
});

async function main() {
  console.log("Creating fake users...");
  const users = [];
  for (let i = 0; i < NUM_USERS; i++) {
    const userData = generateFakeUser();
    const user = await createUser(api, userData);
    console.log(`Created user: ${user.id} - ${user.name}`);
    users.push(user);
  }

  console.log("Creating fake courses...");
  const courses = [];
  for (let i = 0; i < NUM_COURSES; i++) {
    const courseData = generateFakeCourse();
    const course = await createCourse(api, courseData);
    console.log(`Created course: ${course.id} - ${course.name}`);
    courses.push(course);
  }

  console.log("Done!");
  // You can extend this script to enroll users, create assignments, etc.
}

main().catch((err) => {
  if (err.response) {
    console.error("API error:", err.response.data);
  } else {
    console.error(err);
  }
  process.exit(1);
});
