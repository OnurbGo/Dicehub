import { Router } from "express";
import { LoginUser } from "../controllers/LoginController";

const loginRouter = Router();

loginRouter.post("/login", LoginUser);

export default loginRouter;
