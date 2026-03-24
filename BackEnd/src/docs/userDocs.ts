export const userDocs = {
  "/api/users": {
    get: {
      summary: "Listar usuários",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Lista de usuários",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/User" },
              },
            },
          },
        },
        401: { description: "Não autorizado" },
        500: { description: "Erro interno" },
      },
    },
    post: {
      summary: "Criar usuário",
      tags: ["Users"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "display_name", "password"],
              properties: {
                email: { type: "string", example: "user@dicehub.com" },
                display_name: { type: "string", example: "Bruno" },
                password: { type: "string", example: "12345678" },
              },
            },
          },
        },
      },
      responses: {
        201: { description: "Usuário criado com sucesso" },
        400: { description: "Dados inválidos" },
        409: { description: "Email já está em uso" },
        500: { description: "Erro interno" },
      },
    },
  },

  "/api/users/{id}": {
    get: {
      summary: "Buscar usuário por ID",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      responses: {
        200: {
          description: "Usuário encontrado",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/User" },
            },
          },
        },
        400: { description: "ID inválido" },
        401: { description: "Não autorizado" },
        404: { description: "Usuário não encontrado" },
        500: { description: "Erro interno" },
      },
    },
    put: {
      summary: "Atualizar usuário por ID",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: { type: "string", example: "novo@email.com" },
                display_name: { type: "string", example: "Novo Nome" },
                avatar_url: { type: "string", nullable: true },
              },
            },
          },
        },
      },
      responses: {
        200: { description: "Usuário atualizado com sucesso" },
        400: { description: "ID inválido" },
        401: { description: "Não autorizado" },
        403: { description: "Sem permissão" },
        404: { description: "Usuário não encontrado" },
        500: { description: "Erro interno" },
      },
    },
    delete: {
      summary: "Remover usuário por ID",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      responses: {
        200: { description: "Usuário removido com sucesso" },
        400: { description: "ID inválido" },
        401: { description: "Não autorizado" },
        403: { description: "Sem permissão" },
        404: { description: "Usuário não encontrado" },
        500: { description: "Erro interno" },
      },
    },
  },

  "/api/users/{id}/avatar": {
    post: {
      summary: "Upload de avatar por usuário",
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          schema: { type: "integer" },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                avatar: { type: "string", format: "binary" },
              },
              required: ["avatar"],
            },
          },
        },
      },
      responses: {
        200: { description: "Avatar atualizado com sucesso" },
        400: { description: "ID inválido ou arquivo ausente" },
        401: { description: "Não autorizado" },
        403: { description: "Sem permissão" },
        404: { description: "Usuário não encontrado" },
        500: { description: "Erro interno" },
      },
    },
  },
};
