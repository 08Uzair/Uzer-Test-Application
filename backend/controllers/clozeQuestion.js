import { clozeQuestion } from "../models/clozeQuestions.js";

// Add Cloze Question
export const addClozeQuestion = async (req, res) => {
  const {
    userID,
    parentId,
    points,
    questionPreview,
    sentence,
    isAnswer,
    options,
    blanks,
  } = req.body;
  const saveData = new clozeQuestion({
    userID,
    parentId,
    points,
    questionPreview,
    sentence,
    isAnswer,
    options,
    blanks,
    createdAt: new Date().toISOString(),
  });

  try {
    await saveData.save();
    res.status(200).json({ message: "Cloze question added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `${error}` });
  }
};

// Get All Cloze Questions
export const getClozeQuestions = async (req, res) => {
  try {
    const questions = await clozeQuestion.find().sort({ createdAt: -1 });
    res.status(200).json({ questions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch cloze questions" });
  }
};

// Get Cloze Question By Id
export const getClozeQuestionById = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await clozeQuestion.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Cloze question not found" });
    }
    res.status(200).json(question);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update Cloze Question
export const updateClozeQuestion = async (req, res) => {
  const { id } = req.params;
  const { points, questionPreview, sentence, isAnswer, options, blanks } =
    req.body;

  try {
    const updatedData = {
      points,
      questionPreview,
      sentence,
      isAnswer,
      options,
      blanks,
    };

    const updatedQuestion = await clozeQuestion.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Cloze question not found" });
    }

    res.status(200).json({
      updatedQuestion,
      message: "Cloze question updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `${error}` });
  }
};

// Delete Cloze Question
export const deleteClozeQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedQuestion = await clozeQuestion.findByIdAndDelete(id);
    if (!deletedQuestion) {
      return res.status(404).json({ message: "Cloze question not found" });
    }
    res.status(200).json({ message: "Cloze question deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
