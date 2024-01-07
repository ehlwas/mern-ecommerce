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
    case "UPDATE_QUANTITY":
      return {
        ...state,
        cartList: state.cartList.map(item => {
          if (item._id === action.payload._id) {
            return { 
              ...item,
              quantity: action.payload.quantity,
              totalPriceAED: action.payload.totalPriceAED,
              totalPriceUSD: action.payload.totalPriceUSD
            }
          } else {
            return item
          }
        }),
      }
    case "UPDATE_QUANTITY_GUEST":
        return {
          ...state,
          cartList: state.cartList.map(item => {
            if (item.sizeData[0]._id === action.payload.sizeId) {
              return { 
                ...item,
                quantity: action.payload.quantity,
                totalPriceAED: action.payload.totalPriceAED,
                totalPriceUSD: action.payload.totalPriceUSD
              }
            } else {
              return item
            }
          }),
        }
    case "UPDATE_TOTAL_PRICE": 
      return {
        ...state,
        totalPrice: action.payload
      }
    case "REMOVE_ON_CART":
      return {
        ...state,
        cartList: state.cartList.filter(item => {
          if (item._id !== action.payload) {
            return item
          }
        })
      }
    case "REMOVE_ON_CART_GUEST":
        return {
          ...state,
          cartList: state.cartList.filter(item => {
            if (item.sizeData[0]._id !== action.payload) {
              return item
            }
          })
        }
    default:
      return state;
  }
};