
const BLANK_CREATE_FORM = {
  point: {
    type: 'bus',
    destination: 'dest-id-1',
    timeDateStart: new Date().toString(),//день/месяц/год часы:минуты  flatpicker: d/m/Y h:i
    timeDateEnd: new Date().toString(),
    price: 100,
    isFavorite: false,
    offers: [0],
  },
  offers: {
    type: 'bus',
    offers: [
      {
        id: 0,
        title: 'bus upgrade 1',
        price: '31'
      },
      {
        id: 1,
        title: 'bus upgrade 2',
        price: '34'
      },
      {
        id: 2,
        title: 'bus upgrade 3',
        price: '33'
      },
    ],
  },
  destination: {
    id: 'dest-id-1',
    description: 'Monika destination',
    name: 'Monika',
    pictures: []
  },
  destinationsName: [
    'Monika',
    'Mongolia',
    'USA',
    'Thailand',
    'Home']
};

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

export { BLANK_CREATE_FORM, FiltersType, CLEAR_BOARD_TEXT , Mode };
