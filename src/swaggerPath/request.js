module.exports = {
  "/request/send/:status/:toUserId": {
    post: {
      summary: "Send a connection request to another user",
      tags: ["RequestRouter"],
      parameters: [
        {
          in: "path",
          name: "status",
          schema: {
            type: "string",
            enum: ["ignored", "interested"],
          },
          required: true,
          description: "status of connection request",
        },
        {
          in: "path",
          name: "toUserId",
          schema: {
            type: "string",
          },
          required: true,
          description:
            "userId of the user to which connection request is to be sent",
        },
      ],
      responses: {
        200: {
          description: "Connection request sent successfully",
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
        400: {
          description: "Bad request",
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
  "/request/review/:status/:requestId": {
    post: {
      summary: "Review a connection request",
      tags: ["RequestRouter"],
      parameters: [
        {
          in: "path",
          name: "status",
          schema: {
            type: "string",
            enum: ["accepted", "rejected"],
          },
          required: true,
          description: "status of connection request",
        },
        {
          in: "path",
          name: "requestId",
          schema: {
            type: "string",
          },
          required: true,
          description: "id of the connection request to be reviewed",
        },
      ],
      responses: {
        200: {
          description: "Connection request reviewed successfully",
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
        400: {
          description: "Bad request",
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
