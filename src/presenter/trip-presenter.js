import { remove, render,replace, RenderPosition } from '../framework/render.js';
import { FiltersType, BLANK_CREATE_POINT, UpdateType, UserAction } from '../constants.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import ListEmpty from '../view/list-empty.js';
import { filter } from '../utils/filter.js';
import { updateItem } from '../utils/common.js';
import PointPresenter from './point-presenter.js';
import { SortType } from '../constants.js';
import { sortDate, sortPrice, sortTime } from '../utils/date.js';
import NewEventButton from '../view/new-event-button.js';
import FormCeateView from '../view/form-create-view.js';
import InfoView from '../view/info-view.js';

export default class TripPresenter {
  #filterModel = null;
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

  #infoView = null;

  #pointPresenters = new Map();
  #pointsForRender = [];

  constructor({filterModel,tripContainer,pointsModel,mainElement}) {
    this.#filterModel = filterModel;
    this.#tripContainer = tripContainer;
    this.#pointsModel = pointsModel;
    this.#mainElement = mainElement;

    this.#pointsModel.addObserver(this.#handleModelChange);
    this.#filterModel.addObserver(this.#handleModelChange);
  }

  init() {
    this.#pointsData = [...this.#pointsModel.wayPoints];
    this.#destinations = this.#pointsModel.destinations;

    this.#tripList = new TripListView();

    this.#filter = FiltersType.everything;

    this.#renderInfoWiev();
    this.#renderSortWiev();

    render(this.#tripList,this.#tripContainer);

    this.#pointsForRender.sort(sortDate);//сортирую по дате начала событий
    this.#pointsData.sort(sortDate);//сортирую по дате начала событий

    this.#renderNewEventButton();
    this.#renderAPP();
  }

  //основная функция рендер для отрисовки поинтов в борде
  #renderAPP (){

    if(this.#pointsData.length === 0 || this.#filterPointsData === 0){
      this.#renderEmpty();
      return;
    }

    this.#filterPointsData(this.#filterModel.filter);
    this.#sortPointsData();

    for(let i = 0; i < this.#pointsForRender.length; i++){
      this.#renderWayPoint(this.#pointsForRender[i],this.#tripList.element);
    }
  }

  //отрисовывает заглушку, когда точки пусты
  #renderEmpty(){
    this.#listEmpty = new ListEmpty();
    this.#listEmpty.setSortType(this.#filter);
    render(this.#listEmpty,this.#tripList.element);
  }

  //обновляет массив поинтов для рендера сортируя по указанному фильтру
  #filterPointsData(filterPoints){
    this.#pointsForRender = filter[filterPoints]([...this.#pointsModel.wayPoints]);//отфильтрованные точки
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

  //отрисовка точки
  #renderWayPoint (wayPoint , wayPointsContainer){
    const poitPresenter = new PointPresenter({
      pointContainer: wayPointsContainer,
      offers: this.#pointsModel.offers,
      destinations: this.#destinations,
      onModeChange: this.#modeChangeHandle,
      onDataChange: this.#onDataChange
    });

    poitPresenter.init(wayPoint);
    this.#pointPresenters.set(wayPoint.id,poitPresenter);
  }

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
      offers: this.#pointsModel.offers,
      destinations: this.#destinations,
      onTypeChange: this.#onTypeChange,
      onDestinationChange: this.#onDestinationChange,
      onResetClick: this.#onResetNewEventClick,
      onSaveClick: this.#onSaveNewEventClick
    });
    this.#resetAllPresenters();
    render(this.#formCreateEvent,this.#tripList.element,RenderPosition.AFTERBEGIN);
  };

  //Реакция на смену Mode
  #modeChangeHandle = () => {
    this.#removeFormCreate();
    this.#resetAllPresenters();
  };

  //удалить форму создания
  #removeFormCreate(){
    remove(this.#formCreateEvent);
    this.#formCreateEvent = null;
  }

  //сбросить все презентеры
  #resetAllPresenters(){
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.reset());
  }

  #renderSortWiev(){

    const previousSortComponent = this.#sortComponent;

    this.#sortComponent = new SortView({onSortTypeChange: this.#handleSortTypeChange});

    if(previousSortComponent === null){
      render(this.#sortComponent,this.#tripContainer);
    }else{
      replace(this.#sortComponent, previousSortComponent);
      remove(previousSortComponent);
    }
  }

  #renderInfoWiev(){
    const previousInfoComponent = this.#infoView;

    this.#infoView = new InfoView({points:this.#pointsData,offers: this.#pointsModel.offers});//Info wiev

    if (previousInfoComponent === null) {
      render(this.#infoView,this.#mainElement,RenderPosition.AFTERBEGIN);
    }else{
      replace(this.#infoView, previousInfoComponent);
      remove(previousInfoComponent);
    }

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
    this.#removeFormCreate();
  };

  #onSaveNewEventClick = (point) => {
    this.#onDataChange(UserAction.ADD_EVENT, UpdateType.MINOR, point);
    remove(this.#formCreateEvent);//временно
    this.#formCreateEvent = null;
  };

  //событие добавление/изменение/удаление точки маршрута
  #onDataChange = (actionType, updateType, newPoint) => {
    switch (actionType) {
      case UserAction.ADD_EVENT:
        this.#pointsModel.addPoint(updateType, newPoint);
        break;
      case UserAction.UPDATE_EVENT:
        this.#pointsModel.updatePoint(updateType, newPoint);
        break;
      case UserAction.DELETE_EVENT:
        this.#pointsModel.deletePoint(updateType, newPoint);
        break;
    }
  };

  //очистить все точки маршрута и их презентеры
  #clearWayPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }

  //обновить представления списка точек маршрута в случае изменения модели данных
  #handleModelChange = (updateType, id) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(id).init(this.#pointsData.getContentById(id));
        break;
      case UpdateType.MINOR:
        this.#clearWayPoints();
        this.#renderAPP();
        break;
      case UpdateType.MAJOR:
        this.#clearWayPoints();
        this.#currentSortType = SortType.DAY;
        this.init();
        break;
    }

  };
}
