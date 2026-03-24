import { verifyToken } from "../utils/jwt";
import { NextFunction, Request, Response } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const tokenFromHeader = req.header("Authorization")?.replace("Bearer ", "");
  const tokenFromCookie = req.cookies?.authToken;
  const token = tokenFromHeader || tokenFromCookie;

  if (!token) {
    console.log("ta dando não autorizado pq ta sem token");
    return res.status(401).json({ error: "Access denied. No token" });
  }

  try {
    const decoded: any = verifyToken(token);
    // Normaliza payload para garantir que req.user.id exista
    const userId = decoded.id ?? decoded.user?.id;
    if (!userId) {
      console.log("ta dando não autorizado pq ta sem userId");
      return res.status(401).json({ error: "Access denied. Invalid payload" });
    }

    (req as any).user = { id: userId };
    next();
  } catch (error) {
    console.log("ta dando não autorizado pq deu erro", error);
    return res.status(401).json({ error: "Access denied. Invalid token" });
  }
};
