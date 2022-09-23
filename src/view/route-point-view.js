import AbstractView from '../framework/view/abstract-view.js';
import {humanizePointDueDate, formatDate} from '../utils/task';


const createChosenOffersTemplate = (offers) => {

  const template = offers.reduce((prev, cur) => prev.concat(
    `<li class="event__offer">
      <span class="event__offer-title">${ cur.title }</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${ cur.price }</span>
    </li>`
  ), '');

  return `
  <h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
    ${ template }
  </ul>`;

};


const createRoutePointTemplate = (pointModel, point) => {
  const {price, dateFrom, dateTo, type, hoursFrom, hoursTo} = point;
  const checkedOffers = pointModel.getСheckedOffers(point);
  const destination = pointModel.getDestinationById(point.destination);


  return (
    `            <li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="2019-03-18">${formatDate(dateFrom)}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${ type} ${destination ? destination.name : ''}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${hoursFrom}">${humanizePointDueDate(dateFrom)}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${hoursTo}">${humanizePointDueDate(dateTo)}</time>
                  </p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${price ? price : ''}</span>
                </p>

${ createChosenOffersTemplate(checkedOffers) }
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>

`
  );
};

export default class RoutePointView extends AbstractView{
  #pointModel;
  #point = null;


  constructor(pointModel,point) {
    super();
    this.#pointModel = pointModel;

    this.#point = point;

  }

  get template() {
    return createRoutePointTemplate(this.#pointModel, this.#point);
  }

  setOpenClickHandler = (callback) => {
    this._callback.openClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#openClickHandler);
  };

  #openClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.openClick();
  };


}
