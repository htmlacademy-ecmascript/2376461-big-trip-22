import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { DateFormat } from '../constants';


import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(minMax);
dayjs.extend(timezone);

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

//преобразование даты
function convertDate(date, format) {
  return date ? dayjs(date).format(format) : '';
}

//получить самую раннюю дату из точек маршрута
const getMinDate = (items) => convertDate(dayjs.min(items.map((item) => dayjs(item.timeDateStart))), DateFormat.DAY_MONTH);

//получить самую позднюю дату из точек маршрута
const getMaxDate = (items) => convertDate(dayjs.max(items.map((item) => dayjs(item.timeDateEnd))), DateFormat.DAY_MONTH);

function differenceTime(toTime, fromTime) {
  const diffMin = dayjs.utc(toTime).diff(fromTime, 'minute');
  const diffHour = dayjs.utc(toTime).diff(fromTime, 'hour');
  const diffResult = diffMin - diffHour * 60;
  return diffMin < 60 ? `${diffMin + 1}m` : `${diffHour}h ${diffResult + 1}m`;
}

function differenceMinutes(startTime, endTime) {

  const start = dayjs(startTime);
  const end = dayjs(endTime);

  return start.diff(end, 'minute');
}
//sort по дате
const sortByDate = (firstPoint, secondPoint) => dayjs(secondPoint.timeDateStart) - dayjs(firstPoint.timeDateStart);
//sort по цене
const sortPrice = (a, b) => b.price - a.price;
//sort по времени
const sortTime = (a,b) => differenceMinutes(b.timeDateEnd,b.timeDateStart) - differenceMinutes(a.timeDateEnd,a.timeDateStart);

export { isFuture, isPast, isPresent, differenceTime, sortPrice, sortTime, convertDate,sortByDate,getMinDate,getMaxDate };
