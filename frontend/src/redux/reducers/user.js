import { FETCH_USER_ID, FETCH_USER } from "../constants/actionTypes";

const userReducer = (state = { userData: null }, action) => {
  switch (action.type) {
    case FETCH_USER:
      return action.payload;

    case FETCH_USER_ID:
      return [action.payload];
    default:
      return state;
  }
};
export default userReducer;
