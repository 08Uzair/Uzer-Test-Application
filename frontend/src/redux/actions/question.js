import * as api from "../api";
import { FETCH_QUESTIONS } from "../constants/actionTypes";

export const getAllQuestion = (id) => async (dispatch) => {
  try {
    const { data } = await api.fetchAllQuestion(id);
    dispatch({ type: FETCH_QUESTIONS, payload: data });
  } catch (error) {
    console.log(error);
  }
};
