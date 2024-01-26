import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './Models/points-model.js';

const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel();

const tripPresenter = new TripPresenter({filterContainer: filtersElement,tripContainer: tripEventsElement,pointsModel: pointsModel});

tripPresenter.init();
