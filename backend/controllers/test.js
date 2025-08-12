import { testPaper } from "../models/test.js";

// Add Test
export const addTest = async (req, res) => {
  const { userID, title, description, points } = req.body;
  const saveData = new testPaper({
    userID,
    title,
    description,
    points,
    createdAt: new Date().toISOString(),
  });

  try {
    await saveData.save();
    res.status(200).json({ message: "Test added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `${error}` });
  }
};

// Get All Test
export const getTest = async (req, res) => {
  try {
    const test = await testPaper.find().sort({ createdAt: -1 });
    res.status(200).json({ test });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to fetch Test" });
  }
};

// Get Test By Id
export const getTestById = async (req, res) => {
  const { id } = req.params;
  try {
    const test = await testPaper.findById(id);
    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.status(200).json(test);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update Test
export const updateTest = async (req, res) => {
  const { id } = req.params;
  const { title, description, points } = req.body;

  try {
    const updatedData = {
      title,
      description,
      points,
    };

    const updatedTest = await testPaper.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedTest) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.status(200).json({
      updatedTest,
      message: "Test updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `${error}` });
  }
};

// Delete Test
export const deleteTest = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedTest = await testPaper.findByIdAndDelete(id);
    if (!deletedTest) {
      return res.status(404).json({ message: "Test not found" });
    }
    res.status(200).json({ message: "Test deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
