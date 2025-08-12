import {
  FETCH_CLOZE_QUESTIONS,
  CREATE_CLOZE_QUESTION,
  FETCH_CLOZE_QUESTION_ID,
  UPDATE_CLOZE_QUESTION,
  DELETE_CLOZE_QUESTION,
} from "../constants/actionTypes";

const initialState = {
  clozeQuestion: [],
  singleClozeQuestion: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CLOZE_QUESTIONS:
      return {
        ...state,
        clozeQuestion: action.payload,
      };

    case CREATE_CLOZE_QUESTION:
      return {
        ...state,
        clozeQuestion: [...state.clozeQuestion, action.payload],
      };

    case FETCH_CLOZE_QUESTION_ID:
      return {
        ...state,
        singleClozeQuestion: action.payload,
      };

    case DELETE_CLOZE_QUESTION:
      return {
        ...state,
        clozeQuestion: state.clozeQuestion.filter(
          (clozeQuestion) => clozeQuestion._id !== action.payload._id
        ),
      };

    case UPDATE_CLOZE_QUESTION:
      return {
        ...state,
        clozeQuestion: state.clozeQuestion.map((clozeQuestion) =>
          clozeQuestion._id === action.payload._id
            ? action.payload
            : clozeQuestion
        ),
      };

    default:
      return state;
  }
};
