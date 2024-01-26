import { render } from '../framework/render.js';
import { FiltersType } from '../constants.js';
import FiltersView from '../view/filters-view.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import ListEmpty from '../view/list-empty.js';
import { filter } from '../utils/filter.js';
import { updateItem } from '../utils/common.js';
import PointPresenter from './point-presenter.js';
import InfoPresenter from './info-presenter.js';
import { SortType } from '../constants.js';
import { sortDate, sortPrice, sortTime } from '../utils/date.js';

export default class TripPresenter {
  #filterContainer = null;
  #tripContainer = null;
  #pointsModel = null;
  #pointsData = null;
  #destinations = null;
  #filter = FiltersType.everything;

  #listEmpty = null;
  #tripList = null;

  #sortComponent = null;
  #currentSortType = SortType.DAY;

  #infoPresenter = null;

  #pointPresenters = new Map();
  #pointsForRender = [];

  constructor({filterContainer,tripContainer,pointsModel}) {
    this.#filterContainer = filterContainer;
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#pointsData = [...this.#pointsModel.getPoints()];
    this.#destinations = this.#pointsModel.getDestinations();

    this.#tripList = new TripListView();

    this.#filter = FiltersType.everything;

    this.#infoPresenter = new InfoPresenter();//Info wiev
    this.#infoPresenter.init(this.#pointsData);

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

    this.#renderSortWiev();

    render(this.#tripList,this.#tripContainer);

    this.#pointsForRender.sort(sortDate);//сортирую по дате начала событий
    this.#pointsData.sort(sortDate);//сортирую по дате начала событий

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

  //обновляет массив поинтов согласно сортировке
  #sortPointsData(){
    switch(this.#currentSortType){
      case SortType.DAY:
        this.#pointsForRender.sort(sortDate);
        break;
      case SortType.PRICE:
        this.#pointsForRender.sort(sortPrice);
        break;
      case SortType.TIME:
        this.#pointsForRender.sort(sortTime);
        break;
      default:
        this.#pointsForRender.sort(sortDate);
        break;
    }
  }

  //основная функция рендер для отрисовки поинтов в борде
  #renderAPP (){

    if(this.#pointsData.length === 0 || this.#filterPointsData === 0){
      this.#renderEmpty();
      return;
    }
    this.#filterPointsData();
    this.#sortPointsData();

    for(let i = 0; i < this.#pointsForRender.length; i++){
      this.#renderWayPoint(this.#pointsForRender[i],this.#tripList.element);
    }
  }

  //отрисовка точки
  #renderWayPoint (wayPoint , wayPointsContainer){
    const poitPresenter = new PointPresenter({
      pointContainer: wayPointsContainer,
      offers: this.#pointsModel.getOffersByType(wayPoint.type),
      destinations: this.#destinations,
      onModeChange: this.#modeChangeHandle,
      onPointChange: this.#pointChangeHandle
    });

    poitPresenter.init(wayPoint);
    this.#pointPresenters.set(wayPoint.id,poitPresenter);
  }

  #pointChangeHandle = (updatedPoint) => {
    this.#pointsForRender = updateItem(this.#pointsForRender, updatedPoint);
    this.#pointsData = updateItem(this.#pointsData, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  //Реакция на смену Mode
  #modeChangeHandle = () => {
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.reset());
  };

  #renderSortWiev(){
    this.#sortComponent = new SortView({onSortTypeChange: this.#handleSortTypeChange});

    render(this.#sortComponent,this.#tripContainer);
  }

  #handleSortTypeChange = (sortType) => {
    if(sortType === this.#currentSortType){
      return;
    }

    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());
    this.#currentSortType = sortType;

    this.#renderAPP();
  };

}
