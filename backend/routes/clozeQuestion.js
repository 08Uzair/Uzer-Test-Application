import express from "express";
import {
  addClozeQuestion,
  getClozeQuestions,
  getClozeQuestionById,
  updateClozeQuestion,
  deleteClozeQuestion,
} from "../controllers/clozeQuestion.js";

const router = express.Router();

router.post("/", addClozeQuestion);
router.get("/", getClozeQuestions);
router.get("/:id", getClozeQuestionById);
router.put("/:id", updateClozeQuestion);
router.delete("/:id", deleteClozeQuestion);

export default router;
