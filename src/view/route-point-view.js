import {createElement} from '../render.js';
import {offer} from '../fish/offers';
import {humanizePointDueDate} from '../utils';

const createRoutePointTemplate = (task) => {
  const {type, city, price, hoursFrom, hoursTo} = task;
  const pointOfferType = offer.filter((el) => (el.type === type));

  const selectedOffers = pointOfferType.map((el) => `<li class="event__offer">
      <span class="event__offer-title">${el.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${el.price}</span>
    </li>`).join('');

  return (
    `            <li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="2019-03-18">MAR 18</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${city}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${hoursFrom}">${humanizePointDueDate(hoursFrom)}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${hoursTo}">${humanizePointDueDate(hoursTo)}</time>
                  </p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${price}</span>
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

export default class RoutePointView {
  #point = null;
  #destination = null;
  #offers = null;
  #element = null;

  constructor(point, offers, description) {
    this.#point = point;
    this.#destination = description;
    this.#offers = offers;
  }

  get template() {
    return createRoutePointTemplate(this.#point, this.#destination, this.#offers);
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
