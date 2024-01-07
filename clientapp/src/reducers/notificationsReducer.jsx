export const NOTIFICATION_STATE = {
  loading: false,
  notificationList: [],
  error: false,
};

export const notificationsReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_RESTART":
      return {
        loading: true,
        error: false,
        notificationList: [],
      };
    case "FETCH_START":
      return {
        ...state,
        loading: true,
        error: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        notificationList: [...state.notificationList, ...action.payload],
      };
    case "FETCH_ERROR":
      return {
        error: true,
        loading: false,
        notificationList: [],
      };
    case "READ_ALL":
      return {
        ...state,
        notificationList: state.notificationList.map(item => {
          return {
            ...item,
            isRead: true
          }
        })
      }
    case "READ_NOTIFICATION":
      return {
        ...state,
        notificationList: state.notificationList.map(item => {
          if (item._id === action.payload) {
            return {
              ...item,
              isRead: true
            }
          }
          else {
            return item
          }
        })
      }
    default:
      return state;
  }
};