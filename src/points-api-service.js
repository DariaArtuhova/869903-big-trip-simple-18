import ApiService from './framework/api-service.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class PointsApiService extends ApiService {
  get points() {
    return this._load({url: 'points'})
      .then(ApiService.parseResponse);
  }

  updatePoint = async (points) => {
    const response = await this._load({
      url: `points/${points.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(points)),
      headers: new Headers({'Content-Type': 'application/json'}),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  };

  #adaptToServer = (point) => {
    const adaptedTask = {...point,
      'base_price': point.price,
      'destination': point.destinations,
      'date_from': point.dateFrom instanceof Date ? point.dateFrom.toISOString() : null,
      'date_to': point.dateTo instanceof Date ? point.dateTo.toISOString() : null,
    };

    // Ненужные ключи мы удаляем
    delete adaptedTask.dateFrom;
    delete adaptedTask.dateTo;
    delete adaptedTask.price;
    delete adaptedTask.destinations;

    return adaptedTask;
  };
}
