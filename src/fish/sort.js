import {sort} from '../utils/sort';

export const generateSort = () => Object.entries(sort).map(
  ([filterName]) => ({
    name: filterName,
    count: 0,
  }),
);
