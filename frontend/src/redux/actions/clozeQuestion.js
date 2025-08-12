import * as api from "../api";
import {
  FETCH_CLOZE_QUESTIONS,
  CREATE_CLOZE_QUESTION,
  FETCH_CLOZE_QUESTION_ID,
  UPDATE_CLOZE_QUESTION,
  DELETE_CLOZE_QUESTION,
} from "../constants/actionTypes";

export const getClozeQuestion = () => async (dispatch) => {
  try {
    const { data } = await api.fetchClozeQuestion();
    dispatch({ type: FETCH_CLOZE_QUESTIONS, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const createClozeQuestion = (question) => async (dispatch) => {
  try {
    const { data } = await api.createClozeQuestion(question);
    dispatch({ type: CREATE_CLOZE_QUESTION, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const getClozeQuestionByID = (id) => async (dispatch) => {
  try {
    const { data } = await api.fetchClozeQuestionByID(id);
    // console.log(data);
    dispatch({ type: FETCH_CLOZE_QUESTION_ID, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const updateClozeQuestion =
  (id, updatedquestion) => async (dispatch) => {
    try {
      const { data } = await api.updateClozeQuestionById(
        id,
        updatedquestion
      );
      dispatch({ type: UPDATE_CLOZE_QUESTION, payload: data });
    } catch (error) {
      console.log(error);
    }
  };

export const deleteClozeQuestion = (id) => async (dispatch) => {
  try {
    await api.deleteClozeQuestionById(id);
    dispatch({ type: DELETE_CLOZE_QUESTION, payload: id });
  } catch (error) {
    console.log(error);
  }
};
