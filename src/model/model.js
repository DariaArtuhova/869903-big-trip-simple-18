import {generatePoint} from '../fish/point.js';
import {destinations} from '../fish/destination.js';
import {offer} from '../fish/offers.js';

export default class PointsModel {
  points = Array.from({length: 3}, generatePoint);
  destination = destinations;
  offers = offer;

  getPoints = () => this.points;
}
