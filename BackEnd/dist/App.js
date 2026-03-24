"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = __importDefault(require("./config/swagger"));
const LoginRouter_1 = __importDefault(require("./routes/LoginRouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Servir arquivos estáticos da pasta img_upload
app.use("/img_upload", express_1.default.static(path_1.default.join(__dirname, "img_upload")));
// ADICIONE:
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default));
// Rotas
app.use("/api/users", userRoutes_1.default);
app.use("/api/auth", LoginRouter_1.default);
// Rota teste
app.get("/", (req, res) => {
    res.json({ message: "DiceHub API rodando!" });
});
// Sincronizar banco e iniciar servidor
database_1.default
    .sync()
    .then(() => {
    app.listen(port, () => {
        console.log(`Servidor: http://localhost:${port}`);
        console.log(`Swagger: http://localhost:${port}/api-docs`);
    });
})
    .catch((error) => {
    console.error("Falha ao conectar/sincronizar banco:", error);
});
exports.default = app;
//# sourceMappingURL=App.js.map