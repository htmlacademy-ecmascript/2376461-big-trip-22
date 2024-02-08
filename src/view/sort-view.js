import AbstractView from '../framework/view/abstract-view.js';
import { SortType } from '../constants.js';

function createSortButtons (checkedSortType) {
  //disabled - выключено | checked выбрано
  return Object.values(SortType).map((type) => {
    const isDisabled = type === SortType.EVENT || type === SortType.OFFERS ? 'disabled' : '';
    const isChecked = type === checkedSortType ? 'checked' : '';
    return `
    <div class="trip-sort__item  trip-sort__item--${type}">
    <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="${type}" data-sort="${type}" ${isChecked} ${isDisabled}>
    <label class="trip-sort__btn" for="sort-${type}">${type}</label>
    </div>`;
  }).join('');

}

function createSortTemplate(currentSortType) {

  return (
    `  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
            ${createSortButtons(currentSortType)}
      </form>`
  );
}

export default class SortView extends AbstractView{
  #handleSortTypeChange = null;
  #currentSortType = SortType.DAY;

  constructor({currentSortType,onSortTypeChange}) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;

    this.#currentSortType = currentSortType;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  #sortTypeChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'INPUT') {
      if(evt.target.textContent === 'event' || evt.target.textContent === 'offers'){
        return;
      }

      this.#handleSortTypeChange(evt.target?.value);
    }
  };
}
