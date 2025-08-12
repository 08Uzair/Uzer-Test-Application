import mongoose from "mongoose";

const blankSchema = new mongoose.Schema({
  position: {
    type: Number,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const clozeSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    parentId: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
    questionPreview: {
      type: String,
      required: true,
    },
    sentence: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
    },
    isAnswer: {
      type: Boolean,
      default: false,
    },
    blanks: {
      type: [blankSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const clozeQuestion = mongoose.model("clozeQuestion", clozeSchema);
