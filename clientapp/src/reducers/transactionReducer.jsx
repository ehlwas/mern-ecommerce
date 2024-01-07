export const TRANSACTION_STATE = {
  loading: false,
  transactionList: [],
  error: false,
};

export const transactionReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return {
        loading: true,
        error: false,
        transactionList: [],
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        transactionList: action.payload,
      };
    case "FETCH_ERROR":
      return {
        error: true,
        loading: false,
        transactionList: {},
      };
    default:
      return state;
  }
};