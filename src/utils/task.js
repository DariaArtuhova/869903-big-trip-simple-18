import dayjs from 'dayjs';

export const humanizeTaskDueDate = (dueDate) => dayjs(dueDate).format('DD/MM/YYYY H:mm');

export const humanizePointDueDate = (dueDate) => dayjs(dueDate).format('H:mm');
