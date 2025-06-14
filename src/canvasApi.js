const axios = require("axios");

// Constants for identifying our created resources
const FAKER_EMAIL_DOMAIN = "canvas-lms-faker.com";
const FAKER_DESCRIPTION = "Generated by canvas-lms-faker";
const FAKER_COURSE_PREFIX = "FAKER_";

async function createUser(api, userData) {
  // Set email domain to our faker domain
  const taggedData = {
    ...userData,
    pseudonym: {
      ...userData.pseudonym,
      unique_id: userData.pseudonym.unique_id.replace(
        /@.*$/,
        `@${FAKER_EMAIL_DOMAIN}`
      ),
    },
  };
  const res = await api.post("/accounts/1/users", taggedData);
  return res.data;
}

async function createCourse(api, courseData) {
  // Add our description and prefix to the course
  const taggedData = {
    ...courseData,
    course: {
      ...courseData.course,
      public_description: FAKER_DESCRIPTION,
      course_code: `${FAKER_COURSE_PREFIX}${courseData.course.course_code}`,
    },
  };
  const res = await api.post("/accounts/1/courses", taggedData);
  return res.data;
}

async function enrollStudent(api, courseId, userId) {
  // Validate inputs
  if (isNaN(courseId) || isNaN(userId)) {
    throw new Error("courseId and userId must be numbers");
  }

  const res = await api.post(`/courses/${courseId}/enrollments`, {
    enrollment: {
      user_id: userId,
      type: "StudentEnrollment",
      enrollment_state: "active",
    },
  });
  return res.data;
}

async function deleteUser(api, userId) {
  const res = await api.delete(`/users/${userId}`);
  return res.data;
}

async function deleteCourse(api, courseId) {
  // Canvas requires the 'event' parameter for course deletion
  const res = await api.delete(`/courses/${courseId}`, {
    params: {
      event: "delete",
    },
  });
  return res.data;
}

async function listCreatedUsers(api) {
  const res = await api.get("/accounts/1/users", {
    params: {
      search_term: FAKER_EMAIL_DOMAIN,
    },
  });
  return res.data;
}

async function listCreatedCourses(api) {
  const res = await api.get("/accounts/1/courses", {
    params: {
      search_term: FAKER_COURSE_PREFIX,
    },
  });
  return res.data;
}

module.exports = {
  createUser,
  createCourse,
  enrollStudent,
  deleteUser,
  deleteCourse,
  listCreatedUsers,
  listCreatedCourses,
  FAKER_EMAIL_DOMAIN,
  FAKER_DESCRIPTION,
  FAKER_COURSE_PREFIX,
};
