// UserReducerToken.tsx
const INITIAL_STATE = {
  AccountToken: "",
  IsAuthenticated: false,
};

const UserReducerToken = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "TokenUser":
      return { ...state, AccountToken: action.payload, IsAuthenticated: true };
    default:
      return state;
  }
};

export default UserReducerToken;
