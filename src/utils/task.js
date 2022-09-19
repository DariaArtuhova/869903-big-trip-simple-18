import dayjs from 'dayjs';

export const humanizeTaskDueDate = (dueDate) => dayjs(dueDate).format('DD/MM/YY H:mm');

export const humanizePointDueDate = (dueDate) => dayjs(dueDate).format('H:mm');

export const formatDate = (dueDate) => dayjs(dueDate).format('DD MMM');

