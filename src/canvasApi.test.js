const { createUser, createCourse } = require("./canvasApi");

describe("canvasApi", () => {
  let api;

  beforeEach(() => {
    api = {
      post: jest.fn().mockResolvedValue({ data: { id: 1, name: "Test" } }),
    };
  });

  it("createUser should call the correct endpoint and return data", async () => {
    const userData = {
      user: { name: "Test User" },
      pseudonym: { unique_id: "test@example.com" },
    };
    const result = await createUser(api, userData);
    expect(api.post).toHaveBeenCalledWith("/accounts/1/users", userData);
    expect(result).toEqual({ id: 1, name: "Test" });
  });

  it("createCourse should call the correct endpoint and return data", async () => {
    const courseData = {
      course: { name: "Test Course", course_code: "ABC123" },
    };
    const result = await createCourse(api, courseData);
    expect(api.post).toHaveBeenCalledWith("/accounts/1/courses", courseData);
    expect(result).toEqual({ id: 1, name: "Test" });
  });
});
