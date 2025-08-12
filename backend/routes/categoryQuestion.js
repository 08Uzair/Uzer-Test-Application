import express from "express";
import {
  addCategoryQuestion,
  getCategoryQuestions,
  getCategoryQuestionById,
  updateCategoryQuestion,
  deleteCategoryQuestion,
} from "../controllers/categoryQuestion.js";

const router = express.Router();

router.post("/", addCategoryQuestion);
router.get("/", getCategoryQuestions);
router.get("/:id", getCategoryQuestionById);
router.put("/:id", updateCategoryQuestion);
router.delete("/:id", deleteCategoryQuestion);

export default router;
