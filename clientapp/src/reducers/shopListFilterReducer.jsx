export const FILTER_STATE = {
  loading: false,
  filterList: [],
  error: false,
};

export const shopListFilterReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_START":
      return {
        loading: true,
        error: false,
        filterList: [],
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        filterList: action.payload,
      };
    case "FETCH_ERROR":
      return {
        error: true,
        loading: false,
        filterList: {},
      };
    default:
      return state;
  }
};