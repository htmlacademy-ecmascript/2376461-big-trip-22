import Observable from '../framework/observable.js';
import { UpdateType } from '../constants.js';

export default class PointsModel extends Observable {
  #points = [];
  #offers = [];
  #destinations = [];
  #tripApiService = null;

  constructor({tripApiService}){
    super();

    this.#tripApiService = tripApiService;
  }

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
  //---------------------ASYNC--------------------------------

  async init() {
    try {
      const points = await this.#tripApiService.points;
      this.#points = points.map(this.#adaptEventToClient);
      this.#destinations = await this.#tripApiService.destinations;
      this.#offers = await this.#tripApiService.offers;
    } catch(err) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
      this._notify(UpdateType.ERROR, {});
      return;
    }

    this._notify(UpdateType.INIT, {});
  }

  async updateEvent(updateType, update) {
    try {
      const response = await this.#tripApiService.updateEvent(update);

      const updatedEvent = this.#adaptEventToClient(response);

      this.#points = this.#points.map((event) => event.id === updatedEvent.id ? updatedEvent : event);

      this._notify(updateType, updatedEvent);
    } catch(err) {
      throw new Error('Can\'t update event');
    }
  }

  async addEvent(updateType, update) {
    delete update['id'];
    update.type = update.point.type;
    update.destination = update.point.destination;
    delete update['point'];

    try {
      const response = await this.#tripApiService.addEvent(update);

      const newEvent = this.#adaptEventToClient(response);

      this.#points = [
        newEvent,
        ...this.#points
      ];
      this._notify(updateType, newEvent);
    } catch(err) {
      throw new Error('Can\'t add event');
    }
  }

  async deleteEvent(updateType, update) {
    try {
      await this.#tripApiService.deleteEvent(update);

      this.#points = this.#points.filter((event) => event.id !== update.id);
      this._notify(updateType, {});
    } catch(err) {
      throw new Error('Can\'t delete event');
    }
  }

  //---------------------=====--------------------------------

  #adaptEventToClient(event) {
    const adaptedEvent = {
      ...event,
      timeDateStart: event['date_from'] !== null ? new Date(event['date_from']) : event['date_from'], // На клиенте дата хранится как экземпляр Date
      timeDateEnd: event['date_to'] !== null ? new Date(event['date_to']) : event['date_to'], // На клиенте дата хранится как экземпляр Date
      price: event['base_price'],
      isFavorite: event['is_favorite'],
    };

    // remove unnecessary keys
    delete adaptedEvent['date_from'];
    delete adaptedEvent['date_to'];
    delete adaptedEvent['base_price'];
    delete adaptedEvent['is_favorite'];

    return adaptedEvent;
  }

  //получить данные о точке маршрута по её идентификатору
  getPointDataById(id) {
    const point = this.#points.find((item) => item.id === id);
    return point;
  }

}
