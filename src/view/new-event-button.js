import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';

function createButtonTemplate(state) {
  return `<button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button" ${state.disabled ? 'disabled' : ''}>New event</button>`;
}

export default class NewEventButton extends AbstractStatefulView {
  #onNewEventButtonClick = () => {};

  constructor({onNewEventButtonClick}) {
    super();
    this.#onNewEventButtonClick = onNewEventButtonClick;
    this._setState({disabled: false});
    this._restoreHandlers();
  }

  get template() {
    return createButtonTemplate(this._state);
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
