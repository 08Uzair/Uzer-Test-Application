import { categoryQuestion } from "../models/categoryQuestion.js";
import { clozeQuestion } from "../models/clozeQuestions.js";
import { passageQuestion } from "../models/passageQuestions.js";

export const getAllQuestionsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch all question types for the given user
    const categoryQuestions = await categoryQuestion.find({ userId });
    const clozeQuestions = await clozeQuestion.find({ userId });
    const passageQuestions = await passageQuestion.find({ userId });

    res.status(200).json({
      userId,
      categoryQuestions,
      clozeQuestions,
      passageQuestions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
