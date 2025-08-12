import { FETCH_QUESTIONS } from "../constants/actionTypes";

const initialState = {
  allQuestion: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_QUESTIONS:
      return {
        ...state,
        allQuestion: action.payload,
      };
    default:
      return state;
  }
};
