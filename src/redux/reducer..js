import { SET_TASKS, SET_TASK_ID } from "./actions";

const initialState = {
  tasks: [],
  taskId: 1,
}

function taskReducer(state = initialState, action) {
  switch (action.type) {
    case SET_TASKS:
      return {...state, tasks: action.payload};
    case SET_TASK_ID:
      return {...state, taskId: action.payload};
    default: 
    return state;
  }
}

export default taskReducer;