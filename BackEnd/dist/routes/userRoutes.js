"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../config/multer"));
const UserController_1 = require("../controllers/UserController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get("/", authMiddleware_1.authMiddleware, UserController_1.UserController.getAll);
router.get("/:id", authMiddleware_1.authMiddleware, UserController_1.UserController.getUserById);
router.put("/:id", authMiddleware_1.authMiddleware, UserController_1.UserController.updateUser);
router.delete("/:id", authMiddleware_1.authMiddleware, UserController_1.UserController.destroyUserById);
router.post("/:id/avatar", authMiddleware_1.authMiddleware, multer_1.default.single("avatar"), UserController_1.UserController.uploadAvatarById);
router.post("/", UserController_1.UserController.createUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map