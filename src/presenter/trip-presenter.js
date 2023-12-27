import {render,RenderPosition} from '../framework/render.js';
import { BLANK_CREATE_FORM } from '../constants.js';

import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import PointView from '../view/point-view.js';
import FormCeateView from '../view/form-create-view.js';
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

    render(new FormCeateView({
      point:BLANK_CREATE_FORM.point,
      offers:BLANK_CREATE_FORM.offers.offers,
      destination:BLANK_CREATE_FORM.destination,
      destitationNameList:BLANK_CREATE_FORM.destinationsName}),
    tripList.element,RenderPosition.AFTERBEGIN);

    render(new EditView({
      point:this.pointsData[1],
      offers:this.pointsModel.getOffersByType(this.pointsData[1].type),
      destination:this.pointsModel.getDestinationById(this.pointsData[1].destination),
      destitationNameList:this.pointsModel.getDestinationNameList()}),
    tripList.element);

    for(let i = 2; i < this.pointsData.length; i++){
      render(new PointView({
        point:this.pointsData[i],
        offers:this.pointsModel.getOffersByType(this.pointsData[i].type),
        destination:this.pointsModel.getDestinationById(this.pointsData[i].destination)}),
      tripList.element);
    }

  }
}
