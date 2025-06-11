const {
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
} = require("./canvasApi");

describe("canvasApi", () => {
  let api;

  beforeEach(() => {
    api = {
      post: jest.fn().mockResolvedValue({ data: { id: 1, name: "Test" } }),
      get: jest.fn().mockResolvedValue({ data: [] }),
      delete: jest.fn().mockResolvedValue({ data: { id: 1, name: "Test" } }),
    };
  });

  it("createUser should call the correct endpoint and return data", async () => {
    const userData = {
      user: { name: "Test User" },
      pseudonym: { unique_id: "test@example.com" },
    };
    const result = await createUser(api, userData);
    expect(api.post).toHaveBeenCalledWith(
      "/accounts/1/users",
      expect.objectContaining({
        pseudonym: expect.objectContaining({
          unique_id: `test@${FAKER_EMAIL_DOMAIN}`,
        }),
      })
    );
    expect(result).toEqual({ id: 1, name: "Test" });
  });

  it("createCourse should call the correct endpoint and return data", async () => {
    const courseData = {
      course: { name: "Test Course", course_code: "ABC123" },
    };
    const result = await createCourse(api, courseData);
    expect(api.post).toHaveBeenCalledWith(
      "/accounts/1/courses",
      expect.objectContaining({
        course: expect.objectContaining({
          public_description: FAKER_DESCRIPTION,
          course_code: `${FAKER_COURSE_PREFIX}ABC123`,
        }),
      })
    );
    expect(result).toEqual({ id: 1, name: "Test" });
  });

  describe("enrollStudent", () => {
    it("should call the correct endpoint with correct enrollment data", async () => {
      const courseId = 123;
      const userId = 456;
      const expectedEnrollmentData = {
        enrollment: {
          user_id: userId,
          type: "StudentEnrollment",
          enrollment_state: "active",
        },
      };

      const result = await enrollStudent(api, courseId, userId);

      expect(api.post).toHaveBeenCalledWith(
        `/courses/${courseId}/enrollments`,
        expectedEnrollmentData
      );
      expect(result).toEqual({ id: 1, name: "Test" });
    });

    it("should handle API errors gracefully", async () => {
      const error = new Error("API Error");
      api.post.mockRejectedValueOnce(error);

      await expect(enrollStudent(api, 123, 456)).rejects.toThrow("API Error");
    });

    it("should validate courseId and userId are numbers", async () => {
      const invalidCourseId = "not-a-number";
      const invalidUserId = "also-not-a-number";

      await expect(enrollStudent(api, invalidCourseId, 456)).rejects.toThrow();
      await expect(enrollStudent(api, 123, invalidUserId)).rejects.toThrow();
    });
  });

  describe("cleanup functions", () => {
    describe("deleteUser", () => {
      it("should call the correct endpoint to delete a user", async () => {
        const userId = 123;
        const result = await deleteUser(api, userId);

        expect(api.delete).toHaveBeenCalledWith(`/users/${userId}`);
        expect(result).toEqual({ id: 1, name: "Test" });
      });

      it("should handle API errors gracefully", async () => {
        const error = new Error("API Error");
        api.delete.mockRejectedValueOnce(error);

        await expect(deleteUser(api, 123)).rejects.toThrow("API Error");
      });
    });

    describe("deleteCourse", () => {
      it("should call the correct endpoint to delete a course", async () => {
        const courseId = 123;
        const result = await deleteCourse(api, courseId);

        expect(api.delete).toHaveBeenCalledWith(`/courses/${courseId}`, {
          params: { event: "delete" },
        });
        expect(result).toEqual({ id: 1, name: "Test" });
      });

      it("should handle API errors gracefully", async () => {
        const error = new Error("API Error");
        api.delete.mockRejectedValueOnce(error);

        await expect(deleteCourse(api, 123)).rejects.toThrow("API Error");
      });
    });

    describe("listCreatedUsers", () => {
      it("should call the correct endpoint with search term", async () => {
        const mockUsers = [
          { id: 1, name: "User 1" },
          { id: 2, name: "User 2" },
        ];
        api.get.mockResolvedValueOnce({ data: mockUsers });

        const result = await listCreatedUsers(api);

        expect(api.get).toHaveBeenCalledWith("/accounts/1/users", {
          params: { search_term: FAKER_EMAIL_DOMAIN },
        });
        expect(result).toEqual(mockUsers);
      });

      it("should handle API errors gracefully", async () => {
        const error = new Error("API Error");
        api.get.mockRejectedValueOnce(error);

        await expect(listCreatedUsers(api)).rejects.toThrow("API Error");
      });
    });

    describe("listCreatedCourses", () => {
      it("should call the correct endpoint with search term", async () => {
        const mockCourses = [
          { id: 1, name: "Course 1" },
          { id: 2, name: "Course 2" },
        ];
        api.get.mockResolvedValueOnce({ data: mockCourses });

        const result = await listCreatedCourses(api);

        expect(api.get).toHaveBeenCalledWith("/accounts/1/courses", {
          params: { search_term: FAKER_COURSE_PREFIX },
        });
        expect(result).toEqual(mockCourses);
      });

      it("should handle API errors gracefully", async () => {
        const error = new Error("API Error");
        api.get.mockRejectedValueOnce(error);

        await expect(listCreatedCourses(api)).rejects.toThrow("API Error");
      });
    });
  });
});
