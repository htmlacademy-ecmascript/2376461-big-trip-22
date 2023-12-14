import {render,RenderPosition} from '../render.js';

import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import PointView from '../view/point-view.js';
import InfoView from '../view/info-view.js';
import FormCeateView from '../view/form-create-view.js';
import EditView from '../view/form-edit-view.js';

export default class TripPresenter {

  constructor({mainContainer,filterContainer,tripContainer}) {
    this.mainContainer = mainContainer;
    this.filterContainer = filterContainer;
    this.tripContainer = tripContainer;
  }

  init() {
    const tripList = new TripListView();

    render(new InfoView(),this.mainContainer,RenderPosition.AFTERBEGIN);
    render(new FiltersView(), this.filterContainer);
    render(new SortView(),this.tripContainer);
    render(tripList,this.tripContainer);

    render(new FormCeateView(),tripList.element,RenderPosition.AFTERBEGIN);

    for(let i = 0; i < 3; i++){
      render(new PointView(),tripList.element);
    }

    render(new EditView(),tripList.element);
  }
}
