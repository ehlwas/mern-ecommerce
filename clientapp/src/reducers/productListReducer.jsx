export const PRODUCT_STATE = {
  loading: false,
  productList: [],
  error: false,
};

export const productListReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return {
        loading: true,
        error: false,
        productList: [],
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        productList: action.payload,
      };
    case "FETCH_ERROR":
      return {
        error: true,
        loading: false,
        productList: {},
      };
    default:
      return state;
  }
};