import AbstractView from '../framework/view/abstract-view.js';
import { getOffersByType } from '../utils/common.js';

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

function createInfoTemplate(points,offers) {

  const pointsPriceValue = points.reduce((acc, item) => acc + item.price,0);
  const offersPriceValue = calculateOffersPrice(offers,points);

  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>

        <p class="trip-info__dates">18&nbsp;&mdash;&nbsp;20 Mar</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${pointsPriceValue + offersPriceValue}</span>
      </p>
    </section>`
  );
}

export default class InfoView extends AbstractView{
  #points = null;
  #offers = null;

  constructor ({ points, offers }) {
    super();
    this.#points = points;
    this.#offers = offers;
  }

  get template() {
    return createInfoTemplate(this.#points,this.#offers);
  }
}
