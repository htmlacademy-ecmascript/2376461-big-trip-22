import AbstractView from '../framework/view/abstract-view.js';
import { FiltersType } from '../constants.js';
import { typeNameNormalize } from '../utils/common.js';
import { filter } from '../utils/filter.js';

function createFiltersTemplate(points) {

  const renderFilters = (filters) => {
    const allFilters = Object.values(filters);
    return allFilters.map((item) => {
      const isDisabled = filter[item](points).length === 0 ? 'disabled' : '';
      return `
              <div class="trip-filters__filter">
                <input id="filter-${item}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${item}" ${isDisabled}>
                <label class="trip-filters__filter-label" for="filter-${item}">${typeNameNormalize(item)}</label>
              </div>`;
    }).join('');
  };

  return (
    `<form class="trip-filters" action="#" method="get">
    ${renderFilters(FiltersType)}
        <button class="visually-hidden" type="submit">Accept filter</button>
      </form>`
  );
}

export default class FiltersView extends AbstractView{
  #handleFilterClick = null;
  #points = null;

  constructor ({points, onFilterClick}) {
    super();
    this.#handleFilterClick = onFilterClick;
    this.#points = points;
    this.element.parentElement.querySelectorAll('.trip-filters__filter-label').forEach((item) => item.addEventListener('click',this.#handleFilterClick));
  }

  get template() {
    return createFiltersTemplate(this.#points);
  }
}
