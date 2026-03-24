"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUser = void 0;
const UserModel_1 = __importDefault(require("../models/UserModel"));
const jwt_1 = require("../utils/jwt");
const LoginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email or Password are required" });
    }
    const user = await UserModel_1.default.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
        return res.status(400).json({ error: "Email or Password are invalid" });
    }
    const token = (0, jwt_1.generateToken)(user);
    res.cookie("authToken", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ message: "Login successful", token });
};
exports.LoginUser = LoginUser;
//# sourceMappingURL=LoginController.js.map