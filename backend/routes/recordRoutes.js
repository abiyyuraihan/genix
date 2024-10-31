import express from "express";
import * as recordController from "../controllers/recordController.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, recordController.addRecord);
router.get("/child/:childId", auth, recordController.getRecords);

export default router;
