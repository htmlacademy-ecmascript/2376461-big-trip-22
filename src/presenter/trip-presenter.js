import { remove, render,replace, RenderPosition } from '../framework/render.js';
import { FiltersType, BLANK_CREATE_POINT, UpdateType, UserAction } from '../constants.js';
import LoadingView from '../view/loading-view.js';
import SortView from '../view/sort-view.js';
import TripListView from '../view/trip-list-view.js';
import ListEmpty from '../view/list-empty.js';
import { filter } from '../utils/filter.js';
import PointPresenter from './point-presenter.js';
import { SortType } from '../constants.js';
import { sortByDate, sortPrice, sortTime } from '../utils/date.js';
import NewEventButton from '../view/new-event-button.js';
import FormCeateView from '../view/form-create-view.js';
import InfoView from '../view/info-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import FailedTripView from '../view/failed-trip-view.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};
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

  #failedTripComponent = new FailedTripView();
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  #infoView = null;

  #isLoading = true;
  #loadingTripComponent = new LoadingView();

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

    render(this.#tripList,this.#tripContainer);

    this.#pointsForRender.sort(sortByDate);//сортирую по дате начала событий
    this.#pointsData.sort(sortByDate);//сортирую по дате начала событий

    this.#renderNewEventButton();
    this.#renderAPP();
  }

  //основная функция рендер для отрисовки поинтов в борде
  #renderAPP (){

    if (this.#isLoading) {
      render(this.#loadingTripComponent, this.#tripContainer);
      return;
    }

    this.#pointsData = [...this.#pointsModel.wayPoints];
    this.#destinations = this.#pointsModel.destinations;

    if(this.#pointsData.length === 0 || this.#filterPointsData === 0){
      this.#renderEmpty();
      return;
    }else if(this.#listEmpty !== null){
      remove(this.#listEmpty);
    }

    this.#renderInfoWiev();
    this.#renderSortWiev();

    this.#filterPointsData(this.#filterModel.filter);
    this.#sortPointsData();

    this.#removeFormCreate();

    for(let i = 0; i < this.#pointsForRender.length; i++){
      this.#renderWayPoint(this.#pointsForRender[i],this.#tripList.element);
    }
  }

  //отрисовывает заглушку, когда точки пусты
  #renderEmpty(){
    if(this.#listEmpty !== null){
      return;
    }

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
        this.#pointsForRender.sort(sortByDate);
        break;
      case SortType.PRICE:
        this.#pointsForRender.sort(sortPrice);
        break;
      case SortType.TIME:
        this.#pointsForRender.sort(sortTime);
        break;
      default:
        this.#pointsForRender.sort(sortByDate);
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
    this.#resetAllPresenters();
    this.#filterModel.setFilter(UpdateType.MAJOR, FiltersType.everything);

    this.#newEventButtonComponent.updateElement({disabled: true});
    document.addEventListener('keydown', this.#escKeyDownHandler);

    this.#formCreateEvent = new FormCeateView({
      point: BLANK_CREATE_POINT,
      offers: this.#pointsModel.offers,
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
    this.#removeFormCreate();
    this.#resetAllPresenters();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#onResetNewEventClick();
    }
  };

  //удалить форму создания
  #removeFormCreate(){
    this.#newEventButtonComponent.updateElement({disabled: false});
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    remove(this.#formCreateEvent);
    this.#formCreateEvent = null;
  }

  //сбросить все презентеры
  #resetAllPresenters(){
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.reset());
  }

  #renderSortWiev(){
    const previousSortComponent = this.#sortComponent;
    this.#sortComponent = new SortView({currentSortType: this.#currentSortType, onSortTypeChange: this.#handleSortTypeChange});
    if(previousSortComponent === null){
      render(this.#sortComponent,this.#tripContainer,RenderPosition.AFTERBEGIN);
    }else{
      replace(this.#sortComponent, previousSortComponent);
      remove(previousSortComponent);
    }
  }

  #renderInfoWiev(){
    if(this.#pointsData.length === 0){
      return;
    }
    const previousInfoComponent = this.#infoView;

    this.#infoView = new InfoView({points:this.#pointsData,offers: this.#pointsModel.offers,destinations: this.#destinations});//Info wiev

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

    this.#currentSortType = sortType;
    this.#pointPresenters.forEach((pointPresenter) => pointPresenter.destroy());

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
    this.#onDataChange(UserAction.ADD_EVENT, UpdateType.MAJOR, point);
  };

  //событие добавление/изменение/удаление точки маршрута
  #onDataChange = async (actionType, updateType, newPoint) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.ADD_EVENT:
        this.#formCreateEvent.setSaving();
        try {
          await this.#pointsModel.addEvent(updateType, newPoint);
          this.#newEventButtonComponent.updateElement({disabled: false});
        } catch (error) {
          this.#formCreateEvent.setAborting();
        }
        break;
      case UserAction.UPDATE_EVENT:
        this.#pointPresenters.get(newPoint.id).setSaving();
        try {
          await this.#pointsModel.updateEvent(updateType, newPoint);
        } catch (error) {
          this.#pointPresenters.get(newPoint.id).setAborting();
        }
        break;
      case UserAction.DELETE_EVENT:
        this.#pointPresenters.get(newPoint.id).setDeleting();
        try {
          await this.#pointsModel.deleteEvent(updateType, newPoint);
        } catch (error) {
          this.#pointPresenters.get(newPoint.id).setAborting();
        }
        break;
    }
    this.#uiBlocker.unblock();

  };

  //очистить все точки маршрута и их презентеры
  #clearWayPoints() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();

    remove(this.#loadingTripComponent);
  }

  //обновить представления списка точек маршрута в случае изменения модели данных
  #handleModelChange = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(this.#pointsModel.getPointDataById(data.id));
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingTripComponent);
        this.#renderAPP();
        this.#newEventButtonComponent.updateElement({disabled: false});
        break;
      case UpdateType.ERROR:
        this.#isLoading = false;
        this.#newEventButtonComponent.updateElement({disabled: true});
        this.#renderFailedState();
        this.#clearWayPoints();
        break;
    }

  };

  #renderFailedState() {
    render(this.#failedTripComponent, this.#tripContainer);
  }
}
