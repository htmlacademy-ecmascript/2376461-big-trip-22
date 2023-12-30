import {render, replace} from '../framework/render.js';

import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import PointView from '../view/point-view.js';
import EditView from '../view/form-edit-view.js';

export default class TripPresenter {

  constructor({filterContainer,tripContainer,pointsModel}) {
    this.filterContainer = filterContainer;
    this.tripContainer = tripContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    const tripList = new TripListView();
    this.pointsData = [...this.pointsModel.getPoints()];

    render(new FiltersView(), this.filterContainer);
    render(new SortView(),this.tripContainer);
    render(tripList,this.tripContainer);

    for(let i = 0; i < this.pointsData.length; i++){
      this.#renderWayPoint(this.pointsData[i],tripList.element);
    }
  }

  #renderWayPoint (wayPoint,wayPointsContainer){

    const escKeyDownHandler = (evt) => {
      if(evt.key === 'Escape'){
        evt.preventDefault();
        replaceEditFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView({
      point:wayPoint,
      offers:this.pointsModel.getOffersByType(wayPoint.type),
      destination:this.pointsModel.getDestinationById(wayPoint.destination),
      onPointClick: () => {
        replacePointToEditForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }});

    const editPointComponent = new EditView({
      point:wayPoint,
      offers:this.pointsModel.getOffersByType(wayPoint.type),
      destination:this.pointsModel.getDestinationById(wayPoint.destination),
      destitationNameList:this.pointsModel.getDestinationNameList(),
      onEditSubmit: () => {
        replaceEditFormToPoint();
        document.removeEventListener('keydown',escKeyDownHandler);
      }});

    function replacePointToEditForm() {
      replace(editPointComponent,pointComponent);
    }
    function replaceEditFormToPoint() {
      replace(pointComponent,editPointComponent);
    }

    render(pointComponent,wayPointsContainer);
  }

}
