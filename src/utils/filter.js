import {FILTER_TYPES} from '../const';
import {isDateAfter, isDateSame, isDateBefore} from './task';

export const filter = {
  [FILTER_TYPES.everything]: (pointsModel) => pointsModel.map((point) => point),
  [FILTER_TYPES.future]: (pointsModel) => pointsModel.filter((point) => isDateAfter(point.dateFrom) || isDateSame(point.dateFrom) || isDateBefore(point.dateFrom) && isDateAfter(point.dateTo)),
};
