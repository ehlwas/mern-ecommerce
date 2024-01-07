export const PROFILE_STATE = {
    loading: false,
    profileData: {},
    error: false,
  };
  
  export const profileReducer = (state, action) => {
    switch (action.type) {
      case "FETCH_START":
        return {
          loading: true,
          error: false,
          profileData: {},
        };
      case "FETCH_SUCCESS":
        return {
          ...state,
          loading: false,
          profileData: action.payload,
        };
      case "FETCH_ERROR":
        return {
          error: true,
          loading: false,
          profileData: {},
        };
      case "ADD_ADDRESS":
        return {
          ...state,
          loading: false,
          profileData: { ...state.profileData, addressList: action.payload },
        };
      case "UPDATE_ADDRESS":
        return {
          ...state,
          loading: false,
          profileData: { ...state.profileData, addressList: state.profileData.addressList.map(item => {
            if (item._id === action.payload._id)
             return action.payload
            else
              return item
          }) },
        };
      case "REMOVE_ADDRESS":
        return {
          ...state,
          loading: false,
          profileData: { ...state.profileData, addressList: state.profileData.addressList.filter(item => {
            if (item._id !== action.payload)
             return item
          }) },
        };
      case "EDIT_PROFILE":
        return {
          ...state,
          loading: false,
          profileData: { ...state.profileData, ...action },
        }
      default:
        return state;
    }
  };