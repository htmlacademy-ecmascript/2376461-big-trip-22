import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

/**
 * проверка является ли указанная дата будущей по отношению к текущему времени
 * @param {Date} date Дата
 */
const isFuture = (date) => date && dayjs().isBefore(date);

/**
 * проверка является ли указанная дата прошедшей по отношению к текущему времени
 * @param {Date} date Дата
 */
const isPast = (date) => date && dayjs().isAfter(date);

/**
 * проверка находится ли текущее время внутри заданного диапазона
 * @param {Date} dateFrom Дата начала
 * @param {Date} dateTo Дата конца
 */
const isPresent = (dateFrom, dateTo) => dayjs().isSameOrAfter(dateFrom) && dayjs().isSameOrBefore(dateTo);

export { isFuture, isPast, isPresent };
