const { faker } = require("@faker-js/faker");

function generateFakeUser() {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });
  const name = `${firstName} ${lastName}`;
  const short_name = firstName;
  const sortable_name = `${lastName}, ${firstName}`;

  return {
    user: {
      name,
      short_name,
      sortable_name,
    },
    pseudonym: {
      unique_id: email,
      password: "password123",
    },
  };
}

const SUBJECTS = [
  "Algebra",
  "Geometry",
  "Calculus",
  "Statistics",
  "Biology",
  "Chemistry",
  "Physics",
  "Environmental Science",
  "English",
  "Literature",
  "Composition",
  "Creative Writing",
  "World History",
  "US History",
  "Government",
  "Economics",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Art",
  "Music",
  "Theater",
  "Computer Science",
];

const LEVELS = ["", "Honors", "AP", "IB"];
const GRADES = ["9", "10", "11", "12"];

function generateFakeCourse() {
  const subject = faker.helpers.arrayElement(SUBJECTS);
  const level = faker.helpers.arrayElement(LEVELS);
  const grade = faker.helpers.arrayElement(GRADES);

  const courseName = [level, subject, grade].filter(Boolean).join(" ");
  const courseCode = `${subject.substring(0, 3).toUpperCase()}${grade}${
    level ? level.substring(0, 1) : ""
  }`;

  return {
    course: {
      name: courseName,
      course_code: courseCode,
    },
  };
}

module.exports = {
  generateFakeUser,
  generateFakeCourse,
};
