import { combineReducers } from 'redux';
import peer from './peer';

const appReducer = combineReducers({
  peer,
});

export default function rootReducer(state, action){
  return appReducer(state, action);
}
