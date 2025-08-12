import express from "express";
import { getAllQuestionsByUser } from "../controllers/questions.js";

const router = express.Router();

router.get("/:userId", getAllQuestionsByUser);

export default router;
