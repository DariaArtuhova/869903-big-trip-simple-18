export const OFFERS = ['Add luggage', 'Choose seats', 'Add meal', 'Comfort class', 'Business class'];

export const MIN_VALUE_PRICE = 100;

export const MAX_VALUE_PRICE = 400;

export const MIN_VALUE_ID_DESTINATION = 1;

export const MAX_VALUE_ID_DESTINATION = 4;

export const FILTER_TYPES = {
  everything: 'everything',
  future: 'future',
  past: 'past'
};

export const SORT_TYPES = {
  day: 'day',
  price: 'price',
};

export const BLANC_EVENT = {
  price: null,
  dateFrom: null,
  dateTo: null,
  destination: null,
  offers: [],
  type: null,
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
};

export const NO_TASKS = 0;
