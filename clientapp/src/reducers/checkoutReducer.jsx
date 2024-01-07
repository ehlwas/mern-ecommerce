export const CART_STATE = {
  loading: false,
  cartList: [],
  cartCount: 0,
  totalPrice: 0,
  error: false,
};

export const cartListReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return {
        loading: true,
        error: false,
        cartList: [],
        cartCount: 0,
        totalPrice: 0
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        cartList: action.payload.list,
        cartCount: action.payload.count,
        totalPrice: action.payload.totalPrice,
      };
    case "FETCH_ERROR":
      return {
        error: true,
        loading: false,
        cartList: [],
        cartCount: 0,
        totalPrice: 0
      };
    default:
      return state;
  }
};