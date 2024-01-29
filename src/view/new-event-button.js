import AbstractView from '../framework/view/abstract-view.js';

function createButtonTemplate() {
  return '<button class="trip-main__event-add-btn btn btn--big btn--yellow" type="button">New event</button>';
}

export default class NewEventButton extends AbstractView {
  #onNewEventButtonClick = () => {};

  constructor({onNewEventButtonClick}) {
    super();
    this.#onNewEventButtonClick = onNewEventButtonClick;
    this.element.addEventListener('click', this.#newEventButtonClickHandler);
  }

  get template() {
    return createButtonTemplate();
  }

  //открыть форму добавления маршрута
  #newEventButtonClickHandler = (evt) => {
    evt.preventDefault();
    this.#onNewEventButtonClick();
  };
}
