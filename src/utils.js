import dayjs from 'dayjs';

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const humanizeTaskDueDate = (dueDate) => dayjs(dueDate).format('DD/MM/YYYY H:mm');

export const humanizePointDueDate = (dueDate) => dayjs(dueDate).format('H:mm');

