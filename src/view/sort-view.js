import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../constants.js';

function createSortButtons () {
//disabled - выключено | checked выбрано
  return Object.values(SortType).map((type) => {
    const isDisabled = type === SortType.EVENT || type === SortType.OFFERS ? 'disabled' : '';
    return `
    <div class="trip-sort__item  trip-sort__item--${type}">
    <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}" data-sort="${type}" ${isDisabled}>
    <label class="trip-sort__btn" for="sort-${type}">${type}</label>
    </div>`;
  }).join('');

}

function createSortTemplate() {
  return (
    `  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            ${createSortButtons()}
      </form>`
  );
}

export default class SortView extends AbstractView{
  #handleSortTypeChange = null;
  #sortFormElement = null;

  constructor({onSortTypeChange}) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;
    this.#sortFormElement = [...this.element];

    this.#sortFormElement[0].checked = true;

    this.element.addEventListener('click', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate();
  }

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    //похоже на костыль
    if(evt.target.textContent === 'event' || evt.target.textContent === 'offers'){
      return;
    }
    this.#sortFormElement.forEach((item) => {

      if(item.dataset.sort === evt.target.textContent){
        item.checked = true;
      }else{
        item.checked = false;
      }
    });

    this.#handleSortTypeChange(evt.target.textContent);
  };
}
