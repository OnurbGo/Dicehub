"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authDocs = void 0;
exports.authDocs = {
    "/api/auth/login": {
        post: {
            summary: "Login de usuário",
            tags: ["Auth"],
            requestBody: {
                required: true,
                content: {
                    "application/json": {
                        schema: {
                            type: "object",
                            required: ["email", "password"],
                            properties: {
                                email: { type: "string", example: "user@dicehub.com" },
                                password: { type: "string", example: "12345678" },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: "Login realizado com sucesso",
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: {
                                    message: { type: "string", example: "Login successful" },
                                    token: { type: "string" },
                                },
                            },
                        },
                    },
                },
                400: { description: "Email ou senha inválidos/ausentes" },
                404: { description: "Usuário não encontrado" },
                500: { description: "Erro interno" },
            },
        },
    },
};
//# sourceMappingURL=authDocs.js.map