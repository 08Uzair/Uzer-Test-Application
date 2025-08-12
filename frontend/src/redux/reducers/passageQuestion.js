import {
  FETCH_PASSAGE_QUESTIONS,
  CREATE_PASSAGE_QUESTION,
  FETCH_PASSAGE_QUESTION_ID,
  UPDATE_PASSAGE_QUESTION,
  DELETE_PASSAGE_QUESTION,
} from "../constants/actionTypes";

const initialState = {
  passageQuestion: [],
  singlePassageQuestion: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PASSAGE_QUESTIONS:
      return {
        ...state,
        passageQuestion: action.payload,
      };

    case CREATE_PASSAGE_QUESTION:
      return {
        ...state,
        passageQuestion: [...state.passageQuestion, action.payload],
      };

    case FETCH_PASSAGE_QUESTION_ID:
      return {
        ...state,
        singlePassageQuestion: action.payload,
      };

    case DELETE_PASSAGE_QUESTION:
      return {
        ...state,
        passageQuestion: state.passageQuestion.filter(
          (passageQuestion) => passageQuestion._id !== action.payload._id
        ),
      };

    case UPDATE_PASSAGE_QUESTION:
      return {
        ...state,
        passageQuestion: state.passageQuestion.map((passageQuestion) =>
          passageQuestion._id === action.payload._id
            ? action.payload
            : passageQuestion
        ),
      };

    default:
      return state;
  }
};
