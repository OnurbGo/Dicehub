import express from "express";
import path from "path";
import dotenv from "dotenv";
import sequelize from "./config/database";
import userRoutes from "./routes/userRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger";
import loginRouter from "./routes/LoginRouter";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta img_upload
app.use("/img_upload", express.static(path.join(__dirname, "img_upload")));

// ADICIONE:
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use("/api/users", userRoutes);
app.use("/api/auth", loginRouter);

// Rota teste
app.get("/", (req, res) => {
  res.json({ message: "DiceHub API rodando!" });
});

// Sincronizar banco e iniciar servidor
sequelize
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

export default app;
