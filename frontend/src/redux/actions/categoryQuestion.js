import { toast } from "react-toastify";
import * as api from "../api";
import {
  FETCH_CATEGORY_QUESTIONS,
  CREATE_CATEGORY_QUESTION,
  FETCH_CATEGORY_QUESTION_ID,
  UPDATE_CATEGORY_QUESTION,
  DELETE_CATEGORY_QUESTION,
} from "../constants/actionTypes";

export const getCategoryQuestion = () => async (dispatch) => {
  try {
    const { data } = await api.fetchCategoryQuestion();
    dispatch({ type: FETCH_CATEGORY_QUESTIONS, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const createCategoryQuestion = (question) => async (dispatch) => {
  try {
    const { data } = await api.createCategoryQuestion(question);
    dispatch({ type: CREATE_CATEGORY_QUESTION, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const getCategoryQuestionByID = (id) => async (dispatch) => {
  try {
    const { data } = await api.fetchCategoryQuestionByID(id);
    // console.log(data);
    dispatch({ type: FETCH_CATEGORY_QUESTION_ID, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const updateCategoryQuestion =
  (id, updatedquestion) => async (dispatch) => {
    try {
      const { data } = await api.updateCategoryQuestionById(
        id,
        updatedquestion
      );
      dispatch({ type: UPDATE_CATEGORY_QUESTION, payload: data });
    } catch (error) {
      console.log(error);
    }
  };

export const deleteCategoryQuestion = (id) => async (dispatch) => {
  try {
    await api.deleteCategoryQuestionById(id);
    dispatch({ type: DELETE_CATEGORY_QUESTION, payload: id });
  } catch (error) {
    console.log(error);
  }
};
