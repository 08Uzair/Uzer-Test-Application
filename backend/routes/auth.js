import express from "express";
import { getUser, getUserById, signin, signup } from "../controllers/auth.js";
export const authRouter = express.Router();
authRouter.get("/", getUser);
authRouter.get("/:id", getUserById);
authRouter.post("/signIn", signin);
authRouter.post("/signUp", signup);
