import { getOffersInType,getDestinationsMock, getPointsMock } from '../mock/mock-points.js';
import { updateItem } from '../utils/common.js';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #points = getPointsMock();
  #offers = getOffersInType();
  #destinations = getDestinationsMock();

  get wayPoints(){
    return this.#points;//получить точки
  }

  set wayPoints(points) {
    this.#points = [...points];
  }

  get destinations(){
    return this.#destinations;//получить назначения
  }

  set destinations(destinations){
    this.#destinations = [...destinations];
  }

  get offers(){
    return this.#offers;//получить предложения
  }

  set offers(offers){
    this.#offers = [...offers];
  }

  //получить данные о точке маршрута по её идентификатору
  getPointDataById(id) {
    const point = this.#points.find((item) => item.id === id);
    const destination = this.#destinations.find((item) => item.id === point.destination);
    const offers = this.#offers.find((item) => item.type === point.type.toLocaleLowerCase());
    return {
      point: point ?? {},
      destination: destination ?? {},
      offers: offers.offers ?? {}
    };
  }

  //обновить точку маршрута
  updatePoint(updateType, updatedPoint) {
    this.#points = updateItem(this.#points, updatedPoint);
    this._notify(updateType, updatedPoint.id);
  }

  //добавить точку маршрута
  addPoint(updateType, newPoint) {
    this.#points.push(newPoint);
    this._notify(updateType);
  }

  //удалить точку маршрута
  deletePoint(updateType, point) {
    this.#points = this.#points.filter((item) => item.id !== point.id);
    this._notify(updateType);
  }

}
