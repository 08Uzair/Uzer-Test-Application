import express from "express";
import {
  addTest,
  getTest,
  getTestById,
  updateTest,
  deleteTest,
} from "../controllers/test.js";

export const testRouter = express.Router();

testRouter.post("/", addTest);
testRouter.get("/", getTest);
testRouter.get("/:id", getTestById);
testRouter.put("/:id", updateTest);
testRouter.delete("/:id", deleteTest);
