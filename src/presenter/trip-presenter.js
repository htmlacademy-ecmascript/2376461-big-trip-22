import {render, replace} from '../framework/render.js';
import { FiltersType } from '../constants.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import PointView from '../view/point-view.js';
import EditView from '../view/form-edit-view.js';
import ListEmpty from '../view/list-empty.js';
import { filter } from '../utils/filter.js';
export default class TripPresenter {
  #filterContainer = null;
  #tripContainer = null;
  #pointsModel = null;
  #pointsData = null;
  #filter = null;

  #listEmpty = null;
  #tripList = null;

  #pointsForRender = [];

  constructor({filterContainer,tripContainer,pointsModel}) {
    this.#filterContainer = filterContainer;
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#pointsData = [...this.#pointsModel.getPoints()];

    this.#tripList = new TripListView();

    this.#filter = FiltersType.everything;

    //рендер вью фильтров и прокидывание события клика
    render(new FiltersView({points: this.#pointsData,
      onFilterClick: (evt) => {
        evt.preventDefault();
        this.#filter = evt.target.textContent.toLowerCase();
        this.#filterPointsData();
        if(this.#pointsForRender.length === 0){
          return;
        }
        [...this.#tripList.element.children].forEach((item) => {
          item.remove();
        });
        this.#renderAPP();
      }}), this.#filterContainer);

    render(new SortView(),this.#tripContainer);
    render(this.#tripList,this.#tripContainer);
    this.#renderAPP();
  }

  //отрисовывает заглушку, когда точки пусты
  #renderEmpty(){
    this.#listEmpty = new ListEmpty();
    this.#listEmpty.setSortType(this.#filter);
    render(this.#listEmpty,this.#tripList.element);
  }

  //обновляет массив поинтов для рендера сортируя по указанному фильтру
  #filterPointsData(){
    this.#pointsForRender = filter[this.#filter](this.#pointsData);//отфильтрованные точки
  }

  //основная функция рендер для отрисовки поинтов в борде
  #renderAPP (){

    if(this.#pointsData.length === 0 || this.#filterPointsData === 0){
      this.#renderEmpty();
      return;
    }
    this.#filterPointsData();

    for(let i = 0; i < this.#pointsForRender.length; i++){
      this.#renderWayPoint(this.#pointsForRender[i],this.#tripList.element);
    }

  }

  //отрисовка точки
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
      offers:this.#pointsModel.getOffersByType(wayPoint.type),
      destination:this.#pointsModel.getDestinationById(wayPoint.destination),
      onPointClick: () => {
        replacePointToEditForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }});

    const editPointComponent = new EditView({
      point:wayPoint,
      offers:this.#pointsModel.getOffersByType(wayPoint.type),
      destination:this.#pointsModel.getDestinationById(wayPoint.destination),
      destitationNameList:this.#pointsModel.getDestinationNameList(),
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
