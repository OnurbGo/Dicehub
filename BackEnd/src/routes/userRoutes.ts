import { Router } from "express";
import upload from "../config/multer";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/", authMiddleware, UserController.getAll);
router.get("/:id", authMiddleware, UserController.getUserById);
router.put("/:id", authMiddleware, UserController.updateUser);
router.delete("/:id", authMiddleware, UserController.destroyUserById);
router.post(
  "/:id/avatar",
  authMiddleware,
  upload.single("avatar"),
  UserController.uploadAvatarById,
);
router.post("/", UserController.createUser);

export default router;
