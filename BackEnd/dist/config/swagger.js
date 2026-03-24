"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const docs_1 = require("../docs");
const swaggerSpec = {
    openapi: "3.0.0",
    info: {
        title: "DiceHub API",
        version: "1.0.0",
        description: "API para gerenciar campanhas de RPG",
        contact: {
            name: "DiceHub Team",
        },
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Local Server",
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
        schemas: {
            User: {
                type: "object",
                properties: {
                    id: { type: "number" },
                    email: { type: "string" },
                    display_name: { type: "string" },
                    avatar_url: { type: "string", nullable: true },
                    created_at: { type: "string", format: "date-time" },
                    updated_at: { type: "string", format: "date-time" },
                },
            },
            Error: {
                type: "object",
                properties: {
                    error: { type: "string" },
                },
            },
        },
    },
    paths: docs_1.allDocs,
};
exports.default = swaggerSpec;
//# sourceMappingURL=swagger.js.map