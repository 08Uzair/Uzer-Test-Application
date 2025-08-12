import * as api from "../api";
import { FETCH_QUESTIONS } from "../constants/actionTypes";

export const getAllQuestion = () => async (dispatch) => {
  try {
    const { data } = await api.fetchAllQuestion();
    dispatch({ type: FETCH_QUESTIONS, payload: data });
  } catch (error) {
    console.log(error);
  }
};
