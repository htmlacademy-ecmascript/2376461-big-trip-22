
import { FiltersType,UpdateType } from '../constants';
import {render,replace,remove} from '../framework/render.js';
import { filter } from '../utils/filter';
import FiltersView from '../view/filters-view';

export default class FilterPresenter {

  #container = null;
  #tripModel = null;
  #filterModel = null;

  #filterComponent = null;

  constructor({ container, filterModel, pointsModel }){

    this.#container = container;
    this.#tripModel = pointsModel;
    this.#filterModel = filterModel;


    this.#tripModel.addObserver(this.#handleModelChange);
    this.#filterModel.addObserver(this.#handleModelChange);
  }

  get filters() {
    return Object.values(FiltersType).map((name) => ({
      name: name,
      count: filter[name.toLocaleLowerCase()](this.#tripModel.wayPoints).length,
      isChecked: name === this.#filterModel.filter
    }));
  }

  init(){
    const previousFilterComponent = this.#filterComponent;

    const newFilterComponent = new FiltersView({filters: this.filters , onFilterChange: this.#onFilterChange});

    if (previousFilterComponent === null) {
      render(newFilterComponent, this.#container);
    } else {
      replace(newFilterComponent, previousFilterComponent);
      remove(previousFilterComponent);
    }

    this.#filterComponent = newFilterComponent;
  }


  //событие изменение фильтра точек маршрута
  #onFilterChange = (filterType) => {
    if (this.#filterModel.filter !== filterType) {
      this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
    }
  };

  //обновить представления фильтра точек маршрута в случае изменения модели данных
  #handleModelChange = () => {
    this.init();
  };
}
