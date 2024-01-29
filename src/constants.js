
const BLANK_CREATE_POINT = {
  id: '0',
  type: 'taxi',
  destination: '',
  timeDateStart: new Date().toString(),//день/месяц/год часы:минуты  flatpicker: d/m/Y h:i
  timeDateEnd: new Date().toString(),
  price: 0,
  isFavorite: false,
  offers: [],
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

export { BLANK_CREATE_POINT, POINTS_TYPE, FiltersType, CLEAR_BOARD_TEXT , Mode, SortType };
