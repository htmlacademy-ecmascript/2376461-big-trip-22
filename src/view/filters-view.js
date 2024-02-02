import AbstractView from '../framework/view/abstract-view.js';
import { typeNameNormalize } from '../utils/common.js';

function createFiltersTemplate(filters) {

  const renderFilters = (filtersArray) => filtersArray.map((item) => {
    const isDisabled = item.count === 0 ? 'disabled' : '';
    const isChecked = item.isChecked === true ? 'checked' : '';

    return `
              <div class="trip-filters__filter">
                <input id="filter-${item.name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${item.name}" ${isChecked} ${isDisabled}>
                <label class="trip-filters__filter-label" for="filter-${item.name}">${typeNameNormalize(item.name)}</label>
              </div>`;
  }).join('');

  return (
    `<form class="trip-filters" action="#" method="get">
    ${renderFilters(filters)}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
  );
}

export default class FiltersView extends AbstractView{
  #filters = null;
  #onFilterChange = () => {};

  constructor ({filters, onFilterChange}) {
    super();
    this.#filters = filters;
    this.#onFilterChange = onFilterChange;
    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return createFiltersTemplate(this.#filters);
  }

  //событие изменение фильтра
  #filterChangeHandler = (evt) => {
    evt.preventDefault();

    if (evt.target.tagName === 'INPUT') {
      this.#onFilterChange(evt.target.value);
    }
  };
}
