import TripPresenter from './presenter/trip-presenter.js';
import InfoPresenter from './presenter/info-presenter.js';
import PointsModel from './Models/points-model.js';

const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const tripMainElement = document.querySelector('.trip-main');

const pointsModel = new PointsModel();

const infoPresenter = new InfoPresenter({mainContainer: tripMainElement,pointsModel: pointsModel});
const tripPresenter = new TripPresenter({filterContainer: filtersElement,tripContainer: tripEventsElement,pointsModel: pointsModel});

infoPresenter.init();
tripPresenter.init();
