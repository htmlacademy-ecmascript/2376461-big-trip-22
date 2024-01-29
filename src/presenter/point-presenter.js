import { Mode } from '../constants.js';
import {remove, render, replace} from '../framework/render.js';

import PointView from '../view/point-view';
import EditView from '../view/form-edit-view.js';

export default class PointPresenter {
  #point = null;

  #pointContainer = null;
  #offers = [];
  #destinations = [];

  #pointComponent = null;
  #editPointComponent = null;

  #pointChangeHandle = () => {};
  #modeChangeHandle = () => {};

  #mode = Mode.DEFAULT;

  constructor({pointContainer, offers, destinations, onPointChange, onModeChange}) {
    this.#pointContainer = pointContainer;
    this.#offers = offers;
    this.#destinations = destinations;

    this.#pointChangeHandle = onPointChange;
    this.#modeChangeHandle = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#editPointComponent;

    this.#pointComponent = new PointView({
      point:this.#point,
      offers:this.#offers,
      destinations:this.#destinations,
      onEditClick: this.#onEditClick,
      onFavoriteClick: this.#onFavoriteClick });

    this.#editPointComponent = new EditView({
      point:this.#point,
      offers:this.#offers,
      destinations:this.#destinations,
      onTypeChange: this.#onTypeChange,
      onDestinationChange: this.#onDestinationChange,
      onCloseEdit: this.#onCloseEditForm,
      onEditSubmit: () => {
        this.#replaceFormToPoint();
        document.removeEventListener('keydown',this.#escKeyDownHandler);
      }});

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
      return;
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editPointComponent, prevPointEditComponent);
      return;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#editPointComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #replacePointToForm() {
    replace(this.#editPointComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#modeChangeHandle();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#editPointComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  reset() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#mode = Mode.DEFAULT;
      this.#replaceFormToPoint();
    }
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#editPointComponent);
  }

  #onFavoriteClick = () => {
    this.#pointChangeHandle({...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #onEditClick = () => {
    this.#replacePointToForm();
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  //событие изменить тип точки маршрута
  #onTypeChange = (newType) => {
    this.#editPointComponent.setNewType(newType);
  };

  //событие изменить пункт назначения точки маршрута
  #onDestinationChange = (newDestination) => {
    this.#editPointComponent.setNewDestination(newDestination);
  };

  #onCloseEditForm = () => {
    this.#editPointComponent.resetState();
    this.#replaceFormToPoint();
    document.removeEventListener('keydown',this.#escKeyDownHandler);
  };

}
