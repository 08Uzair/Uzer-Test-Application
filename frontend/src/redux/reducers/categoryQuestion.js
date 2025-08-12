import {
  FETCH_CATEGORY_QUESTIONS,
  CREATE_CATEGORY_QUESTION,
  FETCH_CATEGORY_QUESTION_ID,
  UPDATE_CATEGORY_QUESTION,
  DELETE_CATEGORY_QUESTION,
} from "../constants/actionTypes";

const initialState = {
  categoryQuestion: [],
  singleCategoryQuestion: [], 
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CATEGORY_QUESTIONS:
      return {
        ...state,
        categoryQuestion: action.payload,
      };

    case CREATE_CATEGORY_QUESTION:
      return {
        ...state,
        categoryQuestion: [...state.categoryQuestion, action.payload],
      };

    case FETCH_CATEGORY_QUESTION_ID:
      return {
        ...state,
        singleCategoryQuestion: action.payload,
      };

    case DELETE_CATEGORY_QUESTION:
      return {
        ...state,
        categoryQuestion: state.categoryQuestion.filter((categoryQuestion) => categoryQuestion._id !== action.payload._id),
      };

    case UPDATE_CATEGORY_QUESTION:
      return {
        ...state,
        categoryQuestion: state.categoryQuestion.map((categoryQuestion) =>
          categoryQuestion._id === action.payload._id ? action.payload : categoryQuestion
        ),
      };

    default:
      return state;
  }
};
