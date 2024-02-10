import AbstractView from '../framework/view/abstract-view.js';
import { getOffersByType, getItemById } from '../utils/common.js';
import { sortByDate } from '../utils/date.js';
import { getMinDate, getMaxDate } from '../utils/date.js';

function calculateOffersPrice (offersArray,pointsArray){
  let price = 0;

  pointsArray.forEach((point) => {
    const offersPoint = getOffersByType(offersArray,point.type);
    const offersSelected = offersPoint.filter((item) => point.offers.includes(item.id));
    offersSelected.forEach((item) => {
      price += Number(item.price);
    });
  });

  return price;
}

function generateMainTripInfo(pointsArr, destinationsArr){
  if(pointsArr.length === 0 || destinationsArr.length === 0){
    return '';
  }

  if(pointsArr.length > 3){
    const firstPoint = getItemById(pointsArr[0].destination,destinationsArr).name;
    const lastPoint = getItemById(pointsArr[pointsArr.length - 1].destination,destinationsArr).name;
    return `<h1 class="trip-info__title">${firstPoint} &mdash; ... &mdash; ${lastPoint}</h1>`;
  }

  if(pointsArr.length === 2){
    const firstPoint = getItemById(pointsArr[0].destination,destinationsArr).name;
    const lastPoint = getItemById(pointsArr[pointsArr.length - 1].destination,destinationsArr).name;
    return `<h1 class="trip-info__title">${firstPoint} &mdash; ${lastPoint}</h1>`;
  }

  if(pointsArr.length === 1){
    const firstPoint = getItemById(pointsArr[0].destination,destinationsArr).name;
    return `<h1 class="trip-info__title">${firstPoint}</h1>`;
  }

  return `<h1 class="trip-info__title">${getItemById(pointsArr[0].destination,destinationsArr).name} &mdash; ${getItemById(pointsArr[1].destination,destinationsArr).name} &mdash; ${getItemById(pointsArr[2].destination,destinationsArr).name}</h1>`;
}
function generateDatesTrip(pointsArr){
  if(pointsArr.length === 0){
    return '';
  }
  return `<p class="trip-info__dates">${getMinDate(pointsArr)}&nbsp;&mdash;&nbsp;${getMaxDate(pointsArr)}</p>`;
}

function createInfoTemplate(points,offers,destinations) {

  const pointsPriceValue = points.reduce((acc, item) => acc + item.price,0);
  const offersPriceValue = calculateOffersPrice(offers,points);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        ${generateMainTripInfo(points,destinations)}

        ${generateDatesTrip(points)}
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${pointsPriceValue + offersPriceValue}</span>
      </p>
    </section>`
  );
}

export default class InfoView extends AbstractView{
  #points = [];
  #offers = [];
  #destinations = [];

  constructor ({ points, offers, destinations }) {
    super();
    this.#points = points.sort(sortByDate);
    this.#offers = offers;
    this.#destinations = destinations;
  }

  get template() {
    return createInfoTemplate(this.#points,this.#offers, this.#destinations);
  }
}
