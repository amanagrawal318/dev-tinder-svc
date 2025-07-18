module.exports = {
  "/auth/signup": {
    post: {
      summary: "Register a new user",
      tags: ["AuthRouter"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                firstName: {
                  type: "string",
                },
                lastName: {
                  type: "string",
                },
                email: {
                  type: "string",
                },
                password: {
                  type: "string",
                },
              },
              required: ["firstName", "email", "password"],
            },
          },
        },
        responses: {
          200: {
            description: "User saved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "string",
                },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/auth/login": {
    post: {
      summary: "Login a user",
      tags: ["AuthRouter"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                },
                password: {
                  type: "string",
                },
              },
              required: ["email", "password"],
            },
          },
        },
        responses: {
          200: {
            description: "User logged in successfully",
            content: {
              "application/json": {
                schema: {
                  type: "string",
                },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/auth/logout": {
    post: {
      summary: "Logout a user",
      tags: ["AuthRouter"],
      responses: {
        200: {
          description: "User logged out successfully",
          content: {
            "application/json": {
              schema: {
                type: "string",
              },
            },
          },
        },
        500: {
          description: "Server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/auth/forgot-password": {
    post: {
      summary: "Send OTP to user email",
      tags: ["AuthRouter"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: {
                  type: "string",
                },
              },
              required: ["email"],
            },
          },
        },
        responses: {
          200: {
            description: "OTP sent successfully",
            content: {
              "application/json": {
                schema: {
                  type: "string",
                },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  "/auth/update-password": {
    post: {
      summary: "Update user password",
      tags: ["AuthRouter"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                otp: {
                  type: "string",
                },
                password: {
                  type: "string",
                },
              },
              required: ["otp", "password"],
            },
          },
        },
        responses: {
          200: {
            description: "Password updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "string",
                },
              },
            },
          },
          500: {
            description: "Server error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
