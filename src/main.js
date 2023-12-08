import TripPresenter from './presenter/trip-presenter.js';

const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const tripMainElement = document.querySelector('.trip-main');

const tripPresenter = new TripPresenter({mainContainer: tripMainElement,filterContainer: filtersElement,tripContainer: tripEventsElement});

tripPresenter.init();
