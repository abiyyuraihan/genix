import express from "express";
import * as childController from "../controllers/childController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, childController.addChild);
router.get("/", auth, childController.getChildren);
router.get("/:id", auth, childController.getChild);

export default router;
