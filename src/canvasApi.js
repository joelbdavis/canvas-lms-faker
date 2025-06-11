const axios = require("axios");

async function createUser(api, userData) {
  const res = await api.post("/accounts/1/users", userData);
  return res.data;
}

async function createCourse(api, courseData) {
  const res = await api.post("/accounts/1/courses", courseData);
  return res.data;
}

module.exports = {
  createUser,
  createCourse,
};
