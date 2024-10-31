import express from "express";
import * as userController from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/profile", auth, userController.getProfile);
router.put("/profile", auth, userController.updateProfile);

export default router;
