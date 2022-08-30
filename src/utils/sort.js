import dayjs from "dayjs";

export const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }
  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};


export const sortDate = (taskA, taskB) => {
  const weight = getWeightForNullDate(taskA.dateFrom, taskB.dateFrom);

  return weight ?? dayjs(taskA.dateFrom).diff(dayjs(taskB.dateFrom));
};

export const sortPrice = (taskA, taskB) => {
  const weight = getWeightForNullDate(taskA.price, taskB.price);

  return weight ?? dayjs(taskB.price).diff(dayjs(taskA.price));
};
