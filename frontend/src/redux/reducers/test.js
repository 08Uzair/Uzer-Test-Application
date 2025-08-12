import {
  FETCH_TESTS,
  CREATE_TEST,
  FETCH_TEST_ID,
  UPDATE_TEST,
  DELETE_TEST,
} from "../constants/actionTypes";

const initialState = {
  test: [],
  singletest: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TESTS:
      return {
        ...state,
        test: action.payload,
      };

    case CREATE_TEST:
      return {
        ...state,
        test: [...state.test, action.payload],
      };

    case FETCH_TEST_ID:
      return {
        ...state,
        singletest: action.payload,
      };

    case DELETE_TEST:
      return {
        ...state,
        test: state.test.filter((test) => test._id !== action.payload._id),
      };

    case UPDATE_TEST:
      return {
        ...state,
        test: state.test.map((test) =>
          test._id === action.payload._id ? action.payload : test
        ),
      };

    default:
      return state;
  }
};
