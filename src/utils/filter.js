import {FILTER_TYPES} from '../const';
import dayjs from 'dayjs';

const isFuturePoint = (dateFrom, dateTo) => dateFrom && dayjs(dateFrom).isAfter(dayjs(), 'd') || dateTo && dayjs(dateTo).isAfter(dayjs(), 'd') || dateFrom && dayjs(dateFrom).isSame(dayjs(), 'd') || dateTo && dayjs(dateTo).isSame(dayjs(), 'd');
const isPastPoint = (dateFrom, dateTo) => dateFrom && dayjs(dateFrom).isBefore(dayjs(), 'd') || dateTo && dayjs(dateTo).isBefore(dayjs(), 'd');


export const filter = {
  [FILTER_TYPES.everything]: (points) => points,
  [FILTER_TYPES.past]: (points) => points.filter(({dateFrom, dateTo}) => isPastPoint(dateFrom, dateTo)),
  [FILTER_TYPES.future]: (points) => points.filter(({dateFrom, dateTo}) => isFuturePoint(dateFrom, dateTo)),
};
