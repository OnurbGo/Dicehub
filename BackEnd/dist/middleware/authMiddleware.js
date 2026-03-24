"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("../utils/jwt");
const authMiddleware = (req, res, next) => {
    const tokenFromHeader = req.header("Authorization")?.replace("Bearer ", "");
    const tokenFromCookie = req.cookies?.authToken;
    const token = tokenFromHeader || tokenFromCookie;
    if (!token) {
        console.log("ta dando não autorizado pq ta sem token");
        return res.status(401).json({ error: "Access denied. No token" });
    }
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        // Normaliza payload para garantir que req.user.id exista
        const userId = decoded.id ?? decoded.user?.id;
        if (!userId) {
            console.log("ta dando não autorizado pq ta sem userId");
            return res.status(401).json({ error: "Access denied. Invalid payload" });
        }
        req.user = { id: userId };
        next();
    }
    catch (error) {
        console.log("ta dando não autorizado pq deu erro", error);
        return res.status(401).json({ error: "Access denied. Invalid token" });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map