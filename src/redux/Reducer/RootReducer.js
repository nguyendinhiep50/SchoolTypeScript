import { combineReducers } from "redux";
import UserReducerToken from './UserReducerToken';

const RootReducer = combineReducers({
    AccountToken: UserReducerToken
});

export default RootReducer;
