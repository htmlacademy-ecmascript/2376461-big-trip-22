import AbstractView from '../framework/view/abstract-view.js';
import { CLEAR_BOARD_TEXT } from '../constants.js';

function createListEmpty(type) {
  return `<p class="trip-events__msg">${CLEAR_BOARD_TEXT[type]}</p>`;
}

export default class ListEmpty extends AbstractView{
  #type = null;

  constructor () {
    super();
  }

  setSortType(type){
    this.#type = type;
  }

  get template() {
    return createListEmpty(this.#type);
  }
}
