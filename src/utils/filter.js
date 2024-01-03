import { FiltersType } from '../constants.js';
import { isFuture, isPast, isPresent } from '../utils/date.js';

const filter = {
  [FiltersType.everything]: (points) => points,
  [FiltersType.future]: (points) => points.filter((point) => isFuture(point.timeDateStart)),
  [FiltersType.present]: (points) => points.filter((point) => isPresent(point.timeDateStart, point.timeDateEnd)),
  [FiltersType.past]: (points) => points.filter((point) => isPast(point.timeDateEnd)),
};

export { filter };
