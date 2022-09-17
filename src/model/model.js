import Observable from '../framework/observable';
import {UpdateType} from '../const';

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = [];
  #offers = [];
  #destinations = [];

  constructor(pointsApiService) {
    super();
    this.#pointsApiService = pointsApiService;

  }

  get points() {
    return this.#points;
  }

  get offers () {
    return this.#offers;
  }


  get destinations () {
    return this.#destinations;
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

  getDestinationById(pointDestination) {
    const destination = this.#destinations.find((it) => it.id === pointDestination);
    return destination;
  }

  getOffersById(point) {
    const pointOffers = this.#offers.find((it) => it.type === point.type).offers;
    const avaliableOffers = pointOffers.filter((it) => point.offers.includes(it.id));
    return avaliableOffers;
  }

  getIdByDestination(destinationName) {
    const {id} = this.#destinations.find((it) => it.name === destinationName);
    return id;
  }

  #adaptToClient = (point) => {
    const adaptedPoint = {...point,
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      price: point['base_price'],
    };

    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['base_price'];


    return adaptedPoint;
  };
}


