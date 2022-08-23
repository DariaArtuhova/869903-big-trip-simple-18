import {SORT_TYPES} from '../const';

export const sort = {
  [SORT_TYPES.day]: (pointsModel) => pointsModel.sort((a, b) => a.dateFrom - b.dateFrom),
  [SORT_TYPES.event]: (pointsModel) => pointsModel,
  [SORT_TYPES.time]: (pointsModel) => pointsModel,
  [SORT_TYPES.price]: (pointsModel) => pointsModel.sort((a, b) => b.price - a.price),
  [SORT_TYPES.offer]: (pointsModel) => pointsModel,
};
