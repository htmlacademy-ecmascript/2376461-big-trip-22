import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

import FilterModel from './Models/filter-model.js';
import PointsModel from './Models/points-model.js';

const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const tripMainElement = document.querySelector('.trip-main');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({container:filtersElement,filterModel: filterModel, pointsModel:pointsModel});

const tripPresenter = new TripPresenter({
  filterModel: filterModel,
  tripContainer: tripEventsElement,
  pointsModel: pointsModel,
  mainElement:tripMainElement});

filterPresenter.init();
tripPresenter.init();
