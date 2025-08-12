import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  options: {
    type: [optionSchema],
    required: true,
  },
});

const passageSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    parentId: {
      type: String,
      required: true,
    },
    passage: {
      type: String,
      required: true,
    },
    subQuestions: {
      type: [questionSchema],
      required: true,
    },
    isAnswer: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const passageQuestion = mongoose.model("passageQuestion", passageSchema);
