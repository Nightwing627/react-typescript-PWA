export const SET_ERROR = "SET_ERROR";
export const REMOVE_ERROR = "REMOVE_ERROR";

export const formReducer = (state = { formError: [] }, action) => {
  switch (action.type) {
    case SET_ERROR:
      return { ...state, formError: action.formError };
    case REMOVE_ERROR:
      return { ...state, formError: [] };
    default:
      return state;
  }
};
