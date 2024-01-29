import { remove, render, RenderPosition } from '../framework/render.js';
import { FiltersType, BLANK_CREATE_POINT } from '../constants.js';
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
import NewEventButton from '../view/new-event-button.js';
import FormCeateView from '../view/form-create-view.js';

export default class TripPresenter {
  #filterContainer = null;
  #tripContainer = null;
  #pointsModel = null;
  #pointsData = null;
  #destinations = null;
  #filter = FiltersType.everything;
  #newEventButtonComponent = null;
  #mainElement = null;

  #formCreateEvent = null;

  #listEmpty = null;
  #tripList = null;

  #sortComponent = null;
  #currentSortType = SortType.DAY;

  #infoPresenter = null;

  #pointPresenters = new Map();
  #pointsForRender = [];

  constructor({filterContainer,tripContainer,pointsModel,mainElement}) {
    this.#filterContainer = filterContainer;
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#mainElement = mainElement;
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

    this.#renderNewEventButton();
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
      offers: this.#pointsModel.getOffers(),
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

  //отобразить кнопку добавить новую точку маршрута
  #renderNewEventButton() {
    if (this.#newEventButtonComponent === null) {
      this.#newEventButtonComponent = new NewEventButton({onNewEventButtonClick: this.#onNewEventButtonClick});
      render(this.#newEventButtonComponent, this.#mainElement);
    }
  }

  //событие клик по кнопке создать новую точку маршрута
  #onNewEventButtonClick = () => {
    if(this.#formCreateEvent !== null){
      return;
    }

    this.#formCreateEvent = new FormCeateView({
      point: BLANK_CREATE_POINT,
      offers: this.#pointsModel.getOffers(),
      destinations: this.#destinations,
      onTypeChange: this.#onTypeChange,
      onDestinationChange: this.#onDestinationChange,
      onResetClick: this.#onResetNewEventClick,
      onSaveClick: this.#onSaveNewEventClick
    });

    render(this.#formCreateEvent,this.#tripList.element,RenderPosition.AFTERBEGIN);
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

  //событие изменить тип точки маршрута
  #onTypeChange = (newType) => {
    this.#formCreateEvent.setNewType(newType);
  };

  //событие изменить пункт назначения точки маршрута
  #onDestinationChange = (newDestination) => {
    this.#formCreateEvent.setNewDestination(newDestination);
  };

  #onResetNewEventClick = () => {
    remove(this.#formCreateEvent);
    this.#formCreateEvent = null;
  };

  #onSaveNewEventClick = () => {
    remove(this.#formCreateEvent);//временно
    this.#formCreateEvent = null;
  };
}
