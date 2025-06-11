const { generateFakeUser, generateFakeCourse } = require("./fakeData");

describe("generateFakeUser", () => {
  it("should return a user object with expected structure", () => {
    const userData = generateFakeUser();
    console.log("userData = ", userData);
    expect(userData).toHaveProperty("user");
    expect(userData).toHaveProperty("pseudonym");
    expect(typeof userData.user.name).toBe("string");
    expect(typeof userData.user.short_name).toBe("string");
    expect(typeof userData.user.sortable_name).toBe("string");
    expect(typeof userData.pseudonym.unique_id).toBe("string");
    expect(typeof userData.pseudonym.password).toBe("string");
  });
});

describe("generateFakeCourse", () => {
  it("should return a course object with expected structure", () => {
    const courseData = generateFakeCourse();
    console.log("courseData = ", courseData);
    expect(courseData).toHaveProperty("course");
    expect(typeof courseData.course.name).toBe("string");
    expect(typeof courseData.course.course_code).toBe("string");
  });
});
