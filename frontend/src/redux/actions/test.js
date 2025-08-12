import * as api from "../api";
import {
  FETCH_TESTS,
  CREATE_TEST,
  FETCH_TEST_ID,
  UPDATE_TEST,
  DELETE_TEST,
} from "../constants/actionTypes";

export const getTest = () => async (dispatch) => {
  try {
    const { data } = await api.fetchTest();
    dispatch({ type: FETCH_TESTS, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const addTest = (question) => async (dispatch) => {
  try {
    const { data } = await api.createTest(question);
    dispatch({ type: CREATE_TEST, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const getTestByID = (id) => async (dispatch) => {
  try {
    const { data } = await api.fetchTestByID(id);
    // console.log(data);
    dispatch({ type: FETCH_TEST_ID, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const updateTest = (id, updatedquestion) => async (dispatch) => {
  try {
    const { data } = await api.updateTestById(id, updatedquestion);
    dispatch({ type: UPDATE_TEST, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const deleteTest = (id) => async (dispatch) => {
  try {
    await api.deleteTestById(id);
    dispatch({ type: DELETE_TEST, payload: id });
  } catch (error) {
    console.log(error);
  }
};
