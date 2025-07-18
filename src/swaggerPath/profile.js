module.exports = {
  "/profile/view": {
    get: {
      summary: "Get user profile",
      tags: ["ProfileRouter"],
      responses: {
        200: {
          description: "User profile fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  user: {
                    type: "object",
                    properties: {
                      _id: {
                        type: "string",
                      },
                      firstName: {
                        type: "string",
                      },
                      lastName: {
                        type: "string",
                      },
                      email: {
                        type: "string",
                      },
                      age: {
                        type: "number",
                      },
                      gender: {
                        type: "string",
                      },
                      about: {
                        type: "string",
                      },
                      profileUrl: {
                        type: "string",
                      },
                      skills: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                      },
                    },
                  },
                  message: {
                    type: "string",
                  },
                  status: {
                    type: "number",
                  },
                },
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
  "/profile/edit": {
    patch: {
      summary: "Update user profile",
      tags: ["ProfileRouter"],
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
                age: {
                  type: "number",
                },
                gender: {
                  type: "string",
                },
                about: {
                  type: "string",
                },
                profileUrl: {
                  type: "string",
                },
                skills: {
                  type: "array",
                  items: {
                    type: "string",
                  },
                },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "User profile updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  user: {
                    type: "object",
                    properties: {
                      _id: {
                        type: "string",
                      },
                      firstName: {
                        type: "string",
                      },
                      lastName: {
                        type: "string",
                      },
                      email: {
                        type: "string",
                      },
                      age: {
                        type: "number",
                      },
                      gender: {
                        type: "string",
                      },
                      about: {
                        type: "string",
                      },
                      profileUrl: {
                        type: "string",
                      },
                      skills: {
                        type: "array",
                        items: {
                          type: "string",
                        },
                      },
                    },
                  },
                  message: {
                    type: "string",
                  },
                  status: {
                    type: "number",
                  },
                },
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
  "/profile/password": {
    patch: {
      summary: "Update user password",
      tags: ["ProfileRouter"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                password: {
                  type: "string",
                },
              },
              required: ["password"],
            },
          },
        },
      },
      responses: {
        200: {
          description: "User password updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                  },
                  status: {
                    type: "number",
                  },
                },
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
};
