import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel from "../models/UserModel";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "Secret_key";
const JWT_EXPIRES_IN = "7d";

interface TokenPayload {
  user: UserModel;
}

export const generateToken = (user: UserModel): string => {
  return jwt.sign({ user }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new Error("Token inválido ou expirado.");
  }
};
