import AbstractView from '../framework/view/abstract-view.js';
import {OFFERS} from '../fish/offers';
import {humanizePointDueDate, formatDate} from '../utils/task';

const createRoutePointTemplate = (task) => {
  const {type, city, price, hoursFrom, hoursTo, dateFrom} = task;
  const pointOfferType = OFFERS.filter((el) => (el.type === type));

  const selectedOffers = pointOfferType.map((el) => `<li class="event__offer">
      <span class="event__offer-title">${el.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${el.price}</span>
    </li>`).join('');

  return (
    `            <li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="2019-03-18">${formatDate(dateFrom)}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type ? type : ''} ${city ? city : ''}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${hoursFrom}">${humanizePointDueDate(hoursFrom)}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${hoursTo}">${humanizePointDueDate(hoursTo)}</time>
                  </p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${price ? price : ''}</span>
                </p>
                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
${selectedOffers}
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>

`
  );
};

export default class RoutePointView extends AbstractView{
  #point = null;
  #destination = null;
  #offers = null;

  constructor(point, offers, description) {
    super();
    this.#point = point;
    this.#destination = description;
    this.#offers = offers;
  }

  get template() {
    return createRoutePointTemplate(this.#point, this.#destination, this.#offers);
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
