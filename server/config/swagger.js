const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "QuickTxn API",
            version: "1.0.0",
            description: "QuickTxn Fintech Backend API Documentation",
        },

        servers: [
            {
                url: "http://localhost:5000",
                description: "Local Development Server",
            },
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },

        security: [
            {
                bearerAuth: [],
            },
        ],
    },

    apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(options);