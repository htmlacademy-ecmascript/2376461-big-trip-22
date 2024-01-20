import { getRandomPoint,getOffersInType,getDestinationsMock } from '../mock/mock-points.js';

const POINT_COUNT = 5;

export default class PointsModel {

  points = Array.from({length: POINT_COUNT}, getRandomPoint);

  getPoints(){
    return this.points;
  }

  getDestinations(){
    return getDestinationsMock();
  }

  getDestinationById(id){
    const allDestinations = this.getDestinations();
    return allDestinations.find((item) => item.id === id);
  }

  getOffersByType(type){
    this.offer = getOffersInType().filter((item) =>item.type === type);
    return this.offer[0].offers;
  }

  getDestinationNameList(){
    const destinations = this.getDestinations();
    return destinations.map((item) => item.name);
  }
}
