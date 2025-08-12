import { passageQuestion } from "../models/passageQuestions.js";

// Add Passage Question
export const addPassageQuestion = async (req, res) => {
  const { userId, parentId, passage, isAnswer, subQuestions } = req.body;
  const saveData = new passageQuestion({
    userId,
    parentId,
    passage,
    isAnswer,
    subQuestions,
    createdAt: new Date().toISOString(),
  });

  try {
    await saveData.save();
    res.status(200).json({ message: "Passage question added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `${error}` });
  }
};

// Get All Passage Questions
export const getPassageQuestions = async (req, res) => {
  try {
    const passages = await passageQuestion.find().sort({ createdAt: -1 });
    res.status(200).json({ passages });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch passage questions" });
  }
};

// Get Passage Question By Id
export const getPassageQuestionById = async (req, res) => {
  const { id } = req.params;
  try {
    const passage = await passageQuestion.findById(id);
    if (!passage) {
      return res.status(404).json({ message: "Passage question not found" });
    }
    res.status(200).json(passage);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update Passage Question
export const updatePassageQuestion = async (req, res) => {
  const { id } = req.params;
  const { passage, subQuestions, isAnswer } = req.body;

  try {
    const updatedData = {
      passage,
      subQuestions,
      isAnswer,
    };

    const updatedPassage = await passageQuestion.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!updatedPassage) {
      return res.status(404).json({ message: "Passage question not found" });
    }

    res.status(200).json({
      updatedPassage,
      message: "Passage question updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `${error}` });
  }
};

// Delete Passage Question
export const deletePassageQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPassage = await passageQuestion.findByIdAndDelete(id);
    if (!deletedPassage) {
      return res.status(404).json({ message: "Passage question not found" });
    }
    res.status(200).json({ message: "Passage question deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
