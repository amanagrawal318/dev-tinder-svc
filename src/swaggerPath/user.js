module.exports = {
  "/user/connections": {
    get: {
      summary: "Get user connections",
      tags: ["UserRoutes"],
      responses: {
        200: {
          description: "Connections fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  status: { type: "number" },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        firstName: { type: "string" },
                        lastName: { type: "string" },
                        profileUrl: { type: "string" },
                        age: { type: "number" },
                        gender: { type: "string" },
                      },
                    },
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
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/user/requests/received": {
    get: {
      summary: "Get received connection requests",
      tags: ["UserRoutes"],
      responses: {
        200: {
          description: "Connection requests received successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  status: { type: "number" },
                  data: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        fromUserId: {
                          type: "object",
                          properties: {
                            firstName: { type: "string" },
                            lastName: { type: "string" },
                            profileUrl: { type: "string" },
                            age: { type: "number" },
                            gender: { type: "string" },
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
        500: {
          description: "Server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
  "/user/feed": {
    get: {
      summary: "Get user feed",
      tags: ["UserRoutes"],
      parameters: [
        {
          in: "query",
          name: "page",
          schema: {
            type: "integer",
            default: 1,
          },
          required: false,
          description: "Page number for pagination",
        },
        {
          in: "query",
          name: "limit",
          schema: {
            type: "integer",
            default: 10,
          },
          required: false,
          description: "Number of items per page",
        },
      ],
      responses: {
        200: {
          description: "User feed fetched successfully",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    firstName: { type: "string" },
                    lastName: { type: "string" },
                    profileUrl: { type: "string" },
                    age: { type: "number" },
                    gender: { type: "string" },
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
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
};
