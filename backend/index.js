import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { dataBaseConnection } from "./db/connection.js";
import categoryQuestionRoutes from "./routes/categoryQuestion.js";
import clozeQuestionRoutes from "./routes/clozeQuestion.js";
import passageQuestionRoutes from "./routes/passageQuestion.js";
import questionRoutes from "./routes/questions.js";
import { authRouter } from "./routes/auth.js";
import { testRouter } from "./routes/test.js";
const app = express();
const PORT = 8300;
app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

// ROUTES
dataBaseConnection();
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/test", testRouter);
app.use("/api/v1/questions", questionRoutes);
app.use("/api/v1/category-questions", categoryQuestionRoutes);
app.use("/api/v1/cloze-questions", clozeQuestionRoutes);
app.use("/api/v1/passage-questions", passageQuestionRoutes);

// PORT

app.listen(PORT, () => {
  console.log(`SERVER IS CONNECTED TO PORT :${PORT}`);
});
