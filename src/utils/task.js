import dayjs from 'dayjs';
import he from 'he';

export const humanizeTaskDueDate = (dueDate) => dayjs(dueDate).format('DD/MM/YY H:mm');

export const humanizePointDueDate = (dueDate) => dayjs(dueDate).format('H:mm');

export const isDateAfter = (date) => date && dayjs().isAfter(date, 'D MMMM');

export const isDateSame = (date) => date && dayjs().isSame(date, 'D MMMM');

export const isDateBefore = (date) => date && dayjs().isBefore(date, 'D MMMM');

export const formatDate = (dueDate) => dayjs(dueDate).format('DD MMM');

export const encodeValue = (value) => he.encode(value);


