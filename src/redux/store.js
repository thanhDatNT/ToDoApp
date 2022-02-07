import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import taskReducer from './reducer.';

const RootReducer = combineReducers({taskReducer});

export const Store = createStore(RootReducer,applyMiddleware(thunk));