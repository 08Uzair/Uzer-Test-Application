import * as api from "../api";
import { AUTH } from "../constants/actionTypes";
import { toast } from "react-toastify";
export const authSignIn = (newUser) => async (dispatch) => {
  try {
    const { data } = await api.signIn(newUser);
    dispatch({ type: AUTH, payload: data });
    toast.success("Login Sucessfully ");
    setTimeout(() => {
      window.location.reload();
    }, [3000]);
  } catch (error) {
    console.log(error);
  }
};

export const authSignUp = (newUser) => async (dispatch) => {
  try {
    const { data } = await api.signUp(newUser);
    dispatch({ type: AUTH, payload: data });
    toast.success("Register Sucessfully");
    window.location.reload();
  } catch (error) {
    console.log(error);
  }
};
