import { combineReducers } from "redux";
import auth from "./auth";
import categoryQuestion from "./categoryQuestion";
import clozeQuestion from "./clozeQuestion";
import passageQuestion from "./passageQuestion";
import question from "./question";
import user from "./user";
import test from "./test";

const rootReducer = combineReducers({
  auth,
  user,
  test,
  categoryQuestion,
  clozeQuestion,
  passageQuestion,
  question,
});

export default rootReducer;
