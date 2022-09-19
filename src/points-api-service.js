import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  get offers() {
    return this._load({url: 'offers'})
      .then(ApiService.parseResponse);
  }

  get destinations() {
    return this._load({url: 'destinations'})
      .then(ApiService.parseResponse);
  }

  updatePoint = async (point) => {
    const response = await this._load({
      url: `points/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  addPoint = async (point) => {
    const response = await this._load({
      url: 'points',
      method: Method.POST,
      body: JSON.stringify(this.#adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  deletePoint = async (points) => {
    const response = await this._load({
      url: `points/${points.id}`,
      method: Method.DELETE,
    });

    return response;
  };

  #adaptToServer = (point) => {
    const adaptedPoint = {...point,
      'base_price': Number(point.price),
      'date_from': new Date(point.dateFrom).toISOString(),
      'date_to': new Date(point.dateTo).toISOString(),
      'is_favorite': point.isFavorite,
      'id': point.id,
    };

    delete adaptedPoint.price;
    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.id;

    return adaptedPoint;
  };
}
