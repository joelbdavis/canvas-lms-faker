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

function generateFakeCourse() {
  const courseName = faker.company.buzzPhrase() + " " + faker.word.adjective();
  const courseCode = faker.string.alphanumeric({ length: 6, casing: "upper" });

  return {
    course: { name: courseName, course_code: courseCode },
  };
}

module.exports = {
  generateFakeUser,
  generateFakeCourse,
};
