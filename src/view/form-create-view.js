import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { typeNameNormalize, getAllKeyValue, getItemById, getOffersByType } from '../utils/common.js';
import { POINTS_TYPE, CONFIG_DATE_PICKER, DateFormat } from '../constants.js';
import { convertDate } from '../utils/date.js';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createFormCeateTemplate(point,offers,destinations,destinationNames) {
  const destination = getItemById(point.destination,destinations);
  const currentOffers = getOffersByType(offers,point.type);


  const getDestinationName = () => {
    if(destination === undefined){
      return '';
    }
    return destination.name;
  };

  const isOfferCheked = (offer) => point.offers.includes(offer.id) ? 'checked' : '';

  const createDestinationSection = (destinationObject) => {
    if(destinationObject === null || destinationObject === undefined){
      return '';
    }
    if(destinationObject.description === '' && destinationObject.pictures.length === 0){
      return '';
    }

    const showPhotos = () => destinationObject.pictures.map((item) => `<img class="event__photo" src="${item.src}" alt="${item.description}">`).join('');

    return (`<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destinationObject.description}</p>

    <div class="event__photos-container">
      <div class="event__photos-tape">
      ${showPhotos()}
      </div>
    </div>
  </section>`);
  };

  const createOffers = (offersArr) => offersArr.map((item) => `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${item.id}"  value="${item.id}" type="checkbox" name="event-offer-${item.id}" ${isOfferCheked(item)}>
      <label class="event__offer-label" for="event-offer-${item.id}">
        <span class="event__offer-title">${item.title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${item.price}</span>
      </label>
      </div>`).join('');

  const createOffersSection = (offersArr) => {
    if(offersArr.length < 1){
      return '';
    }

    return(`<section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
      ${createOffers(offersArr)}
      </div>
      </section>`);
  };

  const createDestinationOptionList = (destinationArr) => destinationArr.map((item) => `<option value="${item}"></option>`).join('');

  //создать элемент списка у типа точки маршрута
  const createPointTypeTemplate = (item) => {
    const itemLower = item.toLowerCase();
    const isChecked = (itemLower === point.type) ? 'checked' : '';

    return (
      `<div class="event__type-item">
      <input id="event-type-${itemLower}-${point.id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item}" ${isChecked}>
      <label class="event__type-label  event__type-label--${itemLower}" for="event-type-${itemLower}-${point.id}">${item}</label>
      </div>`
    );
  };

  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${point.type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${POINTS_TYPE.map((item) => createPointTypeTemplate(item)).join('')}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-create">
          ${typeNameNormalize(point.type)}
          </label>
          <input class="event__input  event__input--destination" id="event-create" type="text" name="event-create" value="${getDestinationName()}" list="destination-list-create">
          <datalist id="destination-list-create">
            ${createDestinationOptionList(destinationNames)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${convertDate(point.timeDateStart,DateFormat.DAY_MONTH_YEAR_TIME)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${convertDate(point.timeDateEnd,DateFormat.DAY_MONTH_YEAR_TIME)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input type="number" class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${point.price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">${point.isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset">Cancel</button>
      </header>

      ${createOffersSection(currentOffers)}

        ${createDestinationSection(destination)}
      </section>
    </form>
  </li>`
  );
}

export default class FormCeateView extends AbstractStatefulView{
  #point = null;
  #offers = null;
  #destinations = null;
  #destitationNameList = null;

  #datePickerFrom = null;
  #datePickerTo = null;

  #onTypeChange = () => {};
  #onDestinationChange = () => {};
  #onResetClick = () => {};
  #onSaveClick = () => {};

  constructor ({ point, offers, destinations, onTypeChange, onDestinationChange, onResetClick, onSaveClick}) {
    super();

    this._setState({
      ...point,
      isDeleting: false,
      isSaving: false
    });

    this.#onTypeChange = onTypeChange;
    this.#onDestinationChange = onDestinationChange;
    this.#onResetClick = onResetClick;
    this.#onSaveClick = onSaveClick;

    this.#point = point;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#destitationNameList = getAllKeyValue('name',destinations);
    this.setNewType('taxi');
    this._restoreHandlers();
  }

  get template() {
    return createFormCeateTemplate(this._state,this.#offers,this.#destinations,this.#destitationNameList);
  }

  resetState() {
    this.updateElement(this.#point);
  }

  //установить новый тип точки маршрута
  setNewType = (newType) => {
    const newPoint = {...this._state};
    newPoint.type = newType.toLowerCase();
    this._state.offers = [];

    this.updateElement({point: newPoint});
  };


  parseStateToServer(state) {
    delete state.isDeleting;
    delete state.isSaving;

    return state;
  }

  //установить новый пункт назначения
  setNewDestination = (newDestination) => {
    const newPoint = {...this._state.point};
    newPoint.destination = newDestination.id;
    this.updateElement({point: newPoint});
  };

  _restoreHandlers() {
    this.element.querySelector('.event__save-btn').addEventListener('click',this.#saveClickHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#buttonResetClickHandler);

    this.element.querySelector('.event__type-group').addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#offersChangeHandler);

    this.#setDatePickerFrom();
    this.#setDatePickerTo();
  }

  #offersChangeHandler = (event) => {

    event.preventDefault();
    const offer = event.target?.value;
    const isSelected = this._state.offers.indexOf(offer) >= 0;
    const offers = isSelected
      ? this._state.offers.filter((offerItem) => offerItem !== offer)
      : [...this._state.offers, offer];

    this.updateElement({
      offers,
    });
  };

  #pointTypeChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'INPUT') {
      this.updateElement({type: evt.target.value.toLowerCase()});
      this.#onTypeChange(evt.target.value);
    }
  };

  //событие изменение пункта назначения точки маршрута
  #destinationChangeHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'INPUT') {
      const newDestination = this.#destinations.find((destination) => destination.name === evt.target.value);
      if (newDestination) {
        this.updateElement({destination: newDestination.id});
        this.#onDestinationChange(newDestination);
      }
    }
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();

    this._state.price = evt.target.value.replace(/\D/g, '');
  };

  #saveClickHandler = (evt) => {
    evt.preventDefault();
    if(this._state.destination === '' || this._state.price === 0){
      this.shake();
      return;
    }
    this.#onSaveClick(this.parseStateToServer(this._state));
  };

  #buttonResetClickHandler = (evt) => {
    evt.preventDefault();
    this.#onResetClick();
  };


  //установить дату и время начала точки маршрута
  #setDatePickerFrom() {
    this.#datePickerFrom = flatpickr(
      this.element.querySelector('.event__input--time[name="event-start-time"]'),
      {
        ...CONFIG_DATE_PICKER,
        defaultDate: this._state.timeDateEnd,
        maxDate: this._state.timeDateStart,
        onChange: this.#dateFromChangeHandler,
      },
    );
  }

  //событие изменение даты и время начала точки маршрута
  #dateFromChangeHandler = ([userDate]) => {
    this._state.timeDateStart = userDate.toISOString();
  };

  //установить дату и время окончания точки маршрута
  #setDatePickerTo() {
    this.#datePickerTo = flatpickr(
      this.element.querySelector('.event__input--time[name="event-end-time"]'),
      {
        ...CONFIG_DATE_PICKER,
        defaultDate: this._state.timeDateEnd,
        minDate: this._state.timeDateStart,
        onChange: this.#dateToChangeHandler,
      },
    );
  }

  //событие изменение даты и время окончания точки маршрута
  #dateToChangeHandler = ([userDate]) => {
    this._state.timeDateEnd = userDate.toISOString();
  };

  setSaving() {
    this.updateElement({
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.updateElement({
        isSaving: false,
        isDeleting: false,
      });
    };

    this.shake(resetFormState);
  }
}
