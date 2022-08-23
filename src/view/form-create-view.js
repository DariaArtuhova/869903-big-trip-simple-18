import AbstractView from '../framework/view/abstract-view.js';
import {destinations} from '../fish/destination.js';
import {humanizeTaskDueDate} from '../utils/task';
import {offer} from '../fish/offers';

const createNewFormTemplate = (task) => {
  const {type, city, dateFrom, dateTo, price, destination, pointOffer} = task;

  const descriptionComponent = destinations.find((el) => (el.id === destination)).description;

  const photoComponent = destinations.find((el) => (el.id === destination)).pictures[0].src;

  const createPhotosTemplate = () => photoComponent.map((picture) =>
    `<img class="event__photo" src= "${picture}">`
  );

  const pointOfferType = offer.filter((el) => (el.type === type));
  const offerComponent = pointOfferType.map((el) => {
    const checked = (pointOffer === el.id ) ? 'checked' : '';
    return ` <div class="event__offer-selector">
              <input class="event__offer-checkbox visually-hidden" id="event-offer-luggage-1" type="checkbox" ${checked} name="event-offer-luggage">
              <label class="event__offer-label" for="event-offer-luggage-1">
              <span class="event__offer-title"> ${el.title} </span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price"> ${el.price} </span>
              </div>`;
  });

  return (
    `<li class="trip-events__item">
  <form class="event event--edit" action="#" method="post">
    <header class="event__header">
      <div class="event__type-wrapper">
        <label class="event__type  event__type-btn" for="event-type-toggle-1">
          <span class="visually-hidden">Choose event type</span>
          <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
        </label>
        <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
            <div class="event__type-item">
              <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
              <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">${type}</label>
            </div>
          </fieldset>
        </div>
      </div>
      <div class="event__field-group  event__field-group--destination">
        <label class="event__label  event__type-output" for="event-destination-1">
          ${type}
        </label>
        <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
        <datalist id="destination-list-1">
          <option value="Amsterdam"></option>
          <option value="Geneva"></option>
          <option value="Chamonix"></option>
        </datalist>
      </div>
      <div class="event__field-group  event__field-group--time">
        <label class="visually-hidden" for="event-start-time-1">From</label>
        <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeTaskDueDate(dateFrom)}">
        &mdash;
        <label class="visually-hidden" for="event-end-time-1">To</label>
        <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeTaskDueDate(dateTo)}">
      </div>
      <div class="event__field-group  event__field-group--price">
        <label class="event__label" for="event-price-1">
          <span class="visually-hidden">Price</span>
          &euro;
        </label>
        <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
      </div>
      <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
      <button class="event__reset-btn" type="reset">Cancel</button>
    </header>
    <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${offerComponent.join('')}


        </div>
      </section>
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">
${descriptionComponent}
        <div class="event__photos-container">
          <div class="event__photos-tape">
${createPhotosTemplate().join('')}
          </div>
        </div>
      </section>
    </section>
  </form>
</li>`
  );
};

export default class FormCreateView extends AbstractView{
  #point = null;
  #destination = null;
  #offers = null;

  constructor(point, destination, offers) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
  }

  get template() {
    return createNewFormTemplate(this.#point, this.#destination, this.#offers);
  }

}
