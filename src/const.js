export const EVENT_TYPE = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

export const FILTER_TYPES = {
  everything: 'EVERYTHING',
  future: 'FUTURE',
  past: 'PAST'
};

export const SORT_TYPES = {
  day: 'DAY',
  price: 'PRICE',
};

export const UserAction = {
  UPDATE_TASK: 'UPDATE_TASK',
  ADD_TASK: 'ADD_TASK',
  DELETE_TASK: 'DELETE_TASK',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const NO_TASKS = 0;
