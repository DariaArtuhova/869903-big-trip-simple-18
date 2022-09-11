import Observable from '../framework/observable';
import {UpdateType} from "../const";


export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = [];
  #destinations = [];
  #offers = [];

  constructor(pointsApiService) {
    super();
    this.#pointsApiService = pointsApiService;

  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  init = async () => {
    try {
      const points = await this.#pointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
      this.#offers = await this.#pointsApiService.offers;
      this.#destinations = await this.#pointsApiService.destinations;
    } catch(err) {
      this.#points = [];
    }

    this._notify(UpdateType.INIT);
  };

  updatePoint = (updateType, updatePoint) => {
    const index = this.#points.findIndex((point) => point.id === updatePoint.id);

    if (index === -1) {
      throw Error('Can\'t update unexciting trip');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      updatePoint,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, updatePoint);
  };

  addPoint = (updateType, newPoint) => {
    this.#points = [
      newPoint,
      ...this.#points,
    ];

    this._notify(updateType, newPoint);
  };

  deletePoint = (updateType, removedPoint) => {
    const index = this.#points.findIndex((point) => point.id === removedPoint.id);

    if (index === -1) {
      throw Error('Can\'t delete unexciting trip');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, removedPoint);
  };

  #adaptToClient = (point) => {
    const adaptedPoint = {...point,
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'], // На клиенте дата хранится как экземпляр Date
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'], // На клиенте дата хранится как экземпляр Date
      price: point['base_price'],
      destinations: point['destination'],
    };

    // Ненужные ключи мы удаляем
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['base_price'];
    delete adaptedPoint['destination'];

    return adaptedPoint;
  };
}


