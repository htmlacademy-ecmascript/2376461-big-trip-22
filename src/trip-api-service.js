import ApiService from './framework/api-service';
import { ApiMethod } from './constants';


export default class TripApiService extends ApiService {

  get points () {
    return this._load({
      url: 'points'
    }).then(ApiService.parseResponse);
  }

  get destinations () {
    return this._load({
      url: 'destinations'
    }).then(ApiService.parseResponse);
  }

  get offers () {
    return this._load({
      url: 'offers'
    }).then(ApiService.parseResponse);
  }

  async updateEvent(event) {
    const response = await this._load({
      url: `points/${event.id}`,
      method: ApiMethod.PUT,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }

  async addEvent(event) {
    const response = await this._load({
      url: 'points',
      method: ApiMethod.POST,
      body: JSON.stringify(this.#adaptToServer(event)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    return await ApiService.parseResponse(response);
  }

  async deleteEvent(event) {
    return await this._load({
      url: `points/${event.id}`,
      method: ApiMethod.DELETE,
    });
  }

  #adaptToServer(event) {
    const adaptedEvent = {
      ...event,
      'date_from': event.timeDateStart,
      'date_to': event.timeDateEnd,
      'base_price': parseInt(event['price'], 10),
      'is_favorite': event['isFavorite'],
    };

    // remove unnecessary keys
    delete adaptedEvent['timeDateStart'];
    delete adaptedEvent['timeDateEnd'];
    delete adaptedEvent['price'];
    delete adaptedEvent['isFavorite'];

    return adaptedEvent;
  }

}
