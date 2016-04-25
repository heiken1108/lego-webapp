import { Comment } from 'app/actions/ActionTypes';
import merge from 'lodash/merge';
import update from 'lodash/update';

export type EntityID = number;

const initialState = {
  events: {},
  comments: {},
  users: {},
  groups: {},
  quotes: {}
};

function mutations(state = {}, action) {
  switch (action.type) {
    case Comment.ADD_SUCCESS: {
      const [targetType, targetId] = action.meta.commentTarget.split('-');
      return {
        ...state,
        [targetType]: {
          ...state[targetType],
          [targetId]: {
            ...state[targetType][targetId],
            comments: [...state[targetType][targetId].comments, action.payload.result]
          }
        }
      };
    }
  }
  return state;
}

export default function entities(state = initialState, action) {
  let nextState = state;
  if (action.payload && action.payload.entities) {
    nextState = merge({}, nextState, action.payload.entities);
  }
  return mutations(nextState, action);
}


/**
 * Normalizr without arrayOf sets `action.payload.result`
 * to a numeric ID instead of an array. By using this function
 * we ensure that it becomes an array so we can handle it in
 * an uniform way.
 */
function forceArray(value) {
  if (Array.isArray(value)) return value;
  return [value];
}

/**
 */
export const defaultEntityState = {
  items: [],
  isFetching: false,
  error: null
};

/**
 * A sub-reducer that sets common flag for starting an API call.
 */
export function fetchBegin(state) {
  return {
    ...state,
    isFetching: true
  };
}

/**
 * A sub-reducer that sets common flag for a successful API call.
 */
export function fetchSuccess(state, action) {
  return {
    ...state,
    isFetching: false,
    items: forceArray(action.payload.result),
    error: null
  };
}

/**
 * A sub-reducer that sets common flag for a failed API call.
 */
export function fetchFailure(state, action) {
  return {
    ...state,
    isFetching: false,
    error: action.error
  };
}
