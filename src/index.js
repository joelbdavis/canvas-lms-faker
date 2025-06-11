// Usage: node canvas-fake-data.js
// Requires: npm install axios @faker-js/faker dotenv

require("dotenv").config();
const axios = require("axios");
const { faker } = require("@faker-js/faker");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const {
  createUser,
  createCourse,
  enrollStudent,
  deleteUser,
  deleteCourse,
  listCreatedUsers,
  listCreatedCourses,
} = require("./canvasApi");
const { generateFakeUser, generateFakeCourse } = require("./fakeData");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

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
  .option("enrollment-probability", {
    alias: "p",
    type: "number",
    description: "Probability (0-1) of a student being enrolled in a course",
    default: 0.3,
  })
  .option("cleanup", {
    type: "boolean",
    description: "Delete all data created by this script",
    default: false,
  })
  .option("dry-run", {
    type: "boolean",
    description: "Show what would be deleted without actually deleting",
    default: false,
  })
  .help().argv;

// === CONFIGURATION ===
const CANVAS_URL = process.env.CANVAS_URL || "http://localhost:8080/api/v1";
const ACCESS_TOKEN = process.env.CANVAS_TOKEN || "YOUR_ADMIN_TOKEN_HERE";

const NUM_USERS = argv.users;
const NUM_COURSES = argv.courses;
const ENROLLMENT_PROBABILITY = argv.enrollmentProbability;

const api = axios.create({
  baseURL: CANVAS_URL,
  headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
});

async function cleanup() {
  console.log("Finding resources to clean up...");

  const users = await listCreatedUsers(api);
  const courses = await listCreatedCourses(api);

  console.log(
    `Found ${users.length} users and ${courses.length} courses created by this script.`
  );

  if (argv.dryRun) {
    console.log("\nDry run - would delete:");
    users.forEach((user) => console.log(`- User: ${user.name} (${user.id})`));
    courses.forEach((course) =>
      console.log(`- Course: ${course.name} (${course.id})`)
    );
    return;
  }

  const answer = await question(
    `Are you sure you want to delete ${users.length} users and ${courses.length} courses? (yes/no): `
  );

  if (answer.toLowerCase() !== "yes") {
    console.log("Cleanup cancelled.");
    return;
  }

  console.log("\nDeleting courses...");
  for (const course of courses) {
    try {
      await deleteCourse(api, course.id);
      console.log(`Deleted course: ${course.name} (${course.id})`);
    } catch (error) {
      console.error(`Failed to delete course ${course.name}:`, error.message);
    }
  }

  console.log("\nDeleting users...");
  for (const user of users) {
    try {
      await deleteUser(api, user.id);
      console.log(`Deleted user: ${user.name} (${user.id})`);
    } catch (error) {
      console.error(`Failed to delete user ${user.name}:`, error.message);
    }
  }

  console.log("\nCleanup complete!");
}

async function main() {
  if (argv.cleanup) {
    await cleanup();
    return;
  }

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

  console.log("Enrolling students in courses...");
  for (const user of users) {
    for (const course of courses) {
      // Randomly enroll students based on probability
      if (Math.random() < ENROLLMENT_PROBABILITY) {
        try {
          await enrollStudent(api, course.id, user.id);
          console.log(`Enrolled ${user.name} in ${course.name}`);
        } catch (error) {
          console.error(
            `Failed to enroll ${user.name} in ${course.name}:`,
            error.message
          );
        }
      }
    }
  }

  console.log("Done!");
  // You can extend this script to enroll users, create assignments, etc.
}

main()
  .catch((err) => {
    if (err.response) {
      console.error("API error:", err.response.data);
    } else {
      console.error(err);
    }
    process.exit(1);
  })
  .finally(() => {
    rl.close();
  });
