import express from "express";
import { getAllQuestionsByUser } from "../controllers/questions.js";

const router = express.Router();

router.get("/:parentId", getAllQuestionsByUser);

export default router;
