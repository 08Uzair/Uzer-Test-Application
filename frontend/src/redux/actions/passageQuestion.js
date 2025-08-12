import * as api from "../api";
import {
  FETCH_PASSAGE_QUESTIONS,
  CREATE_PASSAGE_QUESTION,
  FETCH_PASSAGE_QUESTION_ID,
  UPDATE_PASSAGE_QUESTION,
  DELETE_PASSAGE_QUESTION,
} from "../constants/actionTypes";

export const getPassageQuestion = () => async (dispatch) => {
  try {
    const { data } = await api.fetchPassageQuestion();
    dispatch({ type: FETCH_PASSAGE_QUESTIONS, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const createPassageQuestion = (question) => async (dispatch) => {
  try {
    const { data } = await api.createPassageQuestion(question);
    dispatch({ type: CREATE_PASSAGE_QUESTION, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const getPassageQuestionByID = (id) => async (dispatch) => {
  try {
    const { data } = await api.fetchPassageQuestionByID(id);
    // console.log(data);
    dispatch({ type: FETCH_PASSAGE_QUESTION_ID, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const updatePassageQuestion =
  (id, updatedquestion) => async (dispatch) => {
    try {
      const { data } = await api.updatePassageQuestionById(id, updatedquestion);
      dispatch({ type: UPDATE_PASSAGE_QUESTION, payload: data });
    } catch (error) {
      console.log(error);
    }
  };

export const deletePassageQuestion = (id) => async (dispatch) => {
  try {
    await api.deletePassageQuestionById(id);
    dispatch({ type: DELETE_PASSAGE_QUESTION, payload: id });
  } catch (error) {
    console.log(error);
  }
};
