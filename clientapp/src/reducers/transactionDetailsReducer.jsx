export const TRANSACTION_DETAILS_STATE = {
  loading: false,
  transactionDetails: {},
  error: false,
};

export const transactionDetailsReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return {
        loading: true,
        error: false,
        transactionDetails: {},
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        transactionDetails: action.payload,
      };
    case "FETCH_ERROR":
      return {
        error: true,
        loading: false,
        transactionDetails: {},
      };
    default:
      return state;
  }
};