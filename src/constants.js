const DateFormat = {
  DAY: 'D',
  DAY_MONTH: 'D MMM',
  MONTH_DAY: 'MMM DD',
  TIME: 'HH:mm',
  DAY_MONTH_YEAR_TIME: 'DD/MM/YY HH:mm',
  MINUTES_WITH_POSTFIX: 'mm[M]',
  HOURS_MINUTES_WITH_POSTFIX: 'HH[H] mm[M]',
  DAY_HOURS_MINUTES_WITH_POSTFIX: 'DD[D] HH[H] mm[M]',
  DATE_PICKER: 'd/m/y H:i',
  DATE_TIME: 'YYYY-MM-DDTHH:mm',
};

const BLANK_CREATE_POINT = {
  id: '0',
  type: 'taxi',
  destination: '',
  timeDateStart: '',//день/месяц/год часы:минуты  flatpicker: d/m/Y h:i
  timeDateEnd: '',
  price: '',
  isFavorite: false,
  offers: [],
};

const CONFIG_DATE_PICKER = {
  enableTime: true,
  'time_24hr': true,
  dateFormat: DateFormat.DATE_PICKER,
};

const POINTS_TYPE = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];

const FiltersType = {
  everything: 'everything',
  future: 'future',
  present: 'present',
  past: 'past'
};

const CLEAR_BOARD_TEXT = {
  everything: 'Click New Event to create your first point',
  future: 'There are no future events now',
  present: 'There are no present events now',
  past: 'There are no past events now'
};

const Mode = {
  DEFAULT: 'default',
  EDITING: 'editing',
};

const SortType = {
  DAY: 'day',
  EVENT: 'event',
  TIME: 'time',
  PRICE: 'price',
  OFFERS: 'offers'
};

const UserAction = {
  UPDATE_EVENT: 'UPDATE_EVENT',
  ADD_EVENT: 'ADD_EVENT',
  DELETE_EVENT: 'DELETE_EVENT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  ERROR: 'ERROR',
};

const ApiMethod = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE'
};

export {
  BLANK_CREATE_POINT,
  DateFormat,
  POINTS_TYPE,
  FiltersType,
  CLEAR_BOARD_TEXT ,
  Mode,
  SortType,
  CONFIG_DATE_PICKER,
  UserAction,
  UpdateType,
  ApiMethod };
