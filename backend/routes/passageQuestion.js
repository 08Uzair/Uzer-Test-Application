import express from "express";
import {
  addPassageQuestion,
  getPassageQuestions,
  getPassageQuestionById,
  updatePassageQuestion,
  deletePassageQuestion,
} from "../controllers/passageQuestion.js";

const router = express.Router();

router.post("/", addPassageQuestion);
router.get("/", getPassageQuestions);
router.get("/:id", getPassageQuestionById);
router.put("/:id", updatePassageQuestion);
router.delete("/:id", deletePassageQuestion);

export default router;
