const swaggerJSDoc = require("swagger-jsdoc");
const authPath = require("./swaggerPath/auth");
const profilePath = require("./swaggerPath/profile");
const requestPath = require("./swaggerPath/request");
const userPath = require("./swaggerPath/user");
// Swagger configuration options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0", // We use OpenAPI 3.0 specification
    info: {
      title: "Dev Tinder Swagger",
      version: "1.0.0",
      description: "API documentation for my Node.js project",
    },
    servers: [
      {
        url: "http://localhost:5000", // Replace with your API base URL
      },
    ],
    paths: {
      ...authPath,
      ...profilePath,
      ...requestPath,
      ...userPath,
    },
  },
  apis: ["./src/routes/*.js"], // Path to the API route files
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJSDoc(swaggerOptions);
// console.log("Swagger Docs:", JSON.stringify(swaggerDocs, null, 2)); // Log generated docs

module.exports = swaggerDocs;
