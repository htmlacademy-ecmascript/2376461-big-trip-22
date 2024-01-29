import AbstractView from '../framework/view/abstract-view.js';
import { typeNameNormalize, getItemById,getOffersByType } from '../utils/common.js';
import dayjs from 'dayjs';
import { differenceTime } from '../utils/date.js';

function createPointTemplate(pointData,offers,destination) {
  const { type,price,timeDateStart,timeDateEnd,isFavorite} = pointData;


  const favoriteCheck = isFavorite ? 'event__favorite-btn--active' : ''; // true or false

  const offersSelected = (point,allOffers) => allOffers.filter((item) => point.offers.includes(item.id));
  // create all li elements of selected offers
  const showOffers = (offersPoint) => offersPoint.map((item) => `<li class="event__offer">
    <span class="event__offer-title">${item.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${item.price}</span>
  </li>`).join('');

  return (
    `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="2019-03-18">${dayjs(timeDateEnd).format('D MMM')}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${typeNameNormalize(type)} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="2019-03-18T10:30">${dayjs(timeDateStart).format('h:mm')}</time>
          &mdash;
          <time class="event__end-time" datetime="2019-03-18T11:00">${dayjs(timeDateEnd).format('h:mm')}</time>
        </p>
        <p class="event__duration">${differenceTime(timeDateEnd,timeDateStart)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
        ${showOffers(offersSelected(pointData,offers))}
      </ul>
      <button class="event__favorite-btn ${favoriteCheck}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
  );
}

export default class PointView extends AbstractView{
  #point = null;
  #offers = null;
  #destination = null;

  #onEditClick = () => {};
  #onFavoriteClick = () => {};

  constructor ({ point,offers, destinations, onEditClick, onFavoriteClick}) {
    super();

    this.#point = point;
    this.#offers = offers;
    this.#destination = getItemById(this.#point.destination,destinations);

    this.#onEditClick = onEditClick;
    this.#onFavoriteClick = onFavoriteClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click',this.#editClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteClickHandler);
  }


  get template() {
    return createPointTemplate(this.#point,getOffersByType(this.#offers,this.#point.type),this.#destination);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#onEditClick();
  };

  #favoriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#onFavoriteClick();
  };

}
