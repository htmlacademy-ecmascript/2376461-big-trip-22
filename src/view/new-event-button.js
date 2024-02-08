import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

function createButtonTemplate() {
  return '<button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button">New event</button>';
}

export default class NewEventButton extends AbstractStatefulView {
  #onNewEventButtonClick = () => {};

  constructor({onNewEventButtonClick}) {
    super();
    this.#onNewEventButtonClick = onNewEventButtonClick;
    this._restoreHandlers();
  }

  get template() {
    return createButtonTemplate();
  }

  _restoreHandlers() {
    this.element.addEventListener('click', this.#newEventButtonClickHandler);
  }

  //открыть форму добавления маршрута
  #newEventButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onNewEventButtonClick();
  };
}
