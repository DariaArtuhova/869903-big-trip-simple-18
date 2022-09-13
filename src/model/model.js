import {generatePoint} from '../fish/point.js';
import Observable from '../framework/observable';

export default class PointsModel extends Observable{
  #points = Array.from({length: 3}, generatePoint);

  get points() {
    return this.#points;
  }

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
}


