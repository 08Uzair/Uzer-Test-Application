import { categoryQuestion } from "../models/categoryQuestion.js";
import { clozeQuestion } from "../models/clozeQuestions.js";
import { passageQuestion } from "../models/passageQuestions.js";

export const getAllQuestionsByUser = async (req, res) => {
  const { parentId } = req.params;

  try {
    // Fetch all question types for the given user
    const categoryQuestions = await categoryQuestion.find({ parentId });
    const clozeQuestions = await clozeQuestion.find({ parentId });
    const passageQuestions = await passageQuestion.find({ parentId });

    res.status(200).json({
      parentId,
      categoryQuestions,
      clozeQuestions,
      passageQuestions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
