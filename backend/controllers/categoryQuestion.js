import { categoryQuestion } from "../models/categoryQuestion.js";

// Add Category Question

export const addCategoryQuestion = async (req, res) => {
  const {
    userID,
    parentId,
    titleContent,
    description,
    points,
    categories,
    isAnswer,
    answers,
  } = req.body;
  const saveData = new categoryQuestion({
    userID,
    parentId,
    titleContent,
    description,
    points,
    categories,
    isAnswer,
    answers,
    createdAt: new Date().toISOString(),
  });

  try {
    await saveData.save();
    res.status(200).json({ message: "Category question added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `${error}` });
  }
};

// Get All Category Questions
export const getCategoryQuestions = async (req, res) => {
  try {
    const questions = await categoryQuestion.find().sort({ createdAt: -1 });
    res.status(200).json({ questions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch category questions" });
  }
};

// Get Category Question By Id
export const getCategoryQuestionById = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await categoryQuestion.findById(id);
    if (!question) {
      return res.status(404).json({ message: "Category question not found" });
    }
    res.status(200).json(question);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update Category Question
export const updateCategoryQuestion = async (req, res) => {
  const { id } = req.params;
  const { titleContent, description, points, isAnswer, categories, answers } =
    req.body;

  try {
    const updatedData = {
      titleContent,
      description,
      points,
      isAnswer,
      categories,
      answers,
    };

    const updatedQuestion = await categoryQuestion.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: "Category question not found" });
    }

    res.status(200).json({
      updatedQuestion,
      message: "Category question updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `${error}` });
  }
};

// Delete Category Question
export const deleteCategoryQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedQuestion = await categoryQuestion.findByIdAndDelete(id);
    if (!deletedQuestion) {
      return res.status(404).json({ message: "Category question not found" });
    }
    res.status(200).json({ message: "Category question deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
