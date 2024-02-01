import Observable from '../framework/observable.js';
import { FiltersType } from '../constants.js';

//класс для представления данных о фильтре путешествия
export default class FilterModel extends Observable {
  #filter = FiltersType.everything;

  get filter() {
    return this.#filter;
  }

  setFilter(updateType, filter) {
    this.#filter = filter;
    this._notify(updateType);
  }
}
