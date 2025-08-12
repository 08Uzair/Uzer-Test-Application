import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  belongsTo: {
    type: String,
    required: true,
  },
});

const categoryQuestionSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    parentId: {
      type: String,
      required: true,
    },
    titleContent: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    categories: {
      type: [String],
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    isAnswer: {
      type: Boolean,
      default: false,
    },
    answers: {
      type: [answerSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const categoryQuestion = mongoose.model(
  "categoryQuestion",
  categoryQuestionSchema
);
