import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {humanizeTaskDueDate} from '../utils/task';
import {destinations} from '../fish/destination';
import {offer} from '../fish/offers';
import {BLANC_EVENT} from '../const';


const createTypeTemplate = (type, checked) => (`
  <div class="event__type-item">
    <input id="event-type-${type}" class="event__type-input visually-hidden" type="radio" name="event-type" value="${type}" ${checked ? 'checked' : ''}>
    <label class="event__type-label event__type-label--${type}" for="event-type-${type}">${type}</label>
  </div>
`);

const createEventTypeTemplate = (types, type) => {
  const typesTemplate = types.map((items) => createTypeTemplate(items, items === type)).join('');
  const icon = type
    ? `<img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">`
    : '';

  return (`
    <div class="event__type-wrapper">
      <label class="event__type event__type-btn" for="event-type-toggle">
        <span class="visually-hidden">Choose event type</span>
        ${icon}
      </label>
      <input class="event__type-toggle visually-hidden" id="event-type-toggle" type="checkbox">
      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
          ${typesTemplate}
        </fieldset>
      </div>
    </div>
  `);
};


const createFormCreateTemplate = (task) => {
  const {type, city, dateFrom, dateTo, price, destination, pointOffer} = task;

  const descriptionComponent = destinations.find((el) => (el.id === destination)).description;

  const pointOfferType = offer.filter((el) => (el.type === type));
  const offerComponent = pointOfferType.map((el) => {
    const checked = (pointOffer === el.id ) ? 'checked' : '';
    return ` <div class="event__offer-selector">
              <input class="event__offer-checkbox visually-hidden" id="event-offer-luggage-1" data-id="${offer.id}" type="checkbox" ${checked} name="event-offer-luggage">
              <label class="event__offer-label" for="event-offer-luggage-1">
              <span class="event__offer-title"> ${el.title} </span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price"> ${el.price} </span>
              </div>`;
  });

  const createEventDestinationTemplate = () => {
    const optionsTemplate = destinations.map(({name}) => `<option value="${name}"></option>`).join('');

    return (`
    <div class="event__field-group event__field-group--destination">
      <label class="event__label event__type-output" for="event-destination">
        ${type}
      </label>
      <input class="event__input event__input--destination" id="event-destination" type="text" name="event-destination" value="${city}" list="destination-list">
      <datalist id="destination-list">
        ${optionsTemplate}
      </datalist>
    </div>
  `);
  };

  const types = offer.map((offers) => offers.type);

  const eventTypeTemplate = createEventTypeTemplate(types, type);

  const destinationTemplate = createEventDestinationTemplate(type, destination, destinations);

  return (`
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          ${eventTypeTemplate}
          ${destinationTemplate}
          <div class="event__field-group event__field-group--time">
            <label class="visually-hidden" for="event-start-time">From</label>
            <input class="event__input event__input--time" id="event-start-time" type="text" name="event-start-time" value="${humanizeTaskDueDate(dateFrom)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time">To</label>
            <input class="event__input event__input--time" id="event-end-time" type="text" name="event-end-time" value="${humanizeTaskDueDate(dateTo)}">
          </div>
          <div class="event__field-group event__field-group--price">
            <label class="event__label" for="event-price">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input event__input--price" id="event-price" type="number" min="1" name="event-price" value="${price}">
          </div>
          <button class="event__save-btn btn btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Close event</span>
          </button>
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
      </section>
    </section>
      </form>
    </li>
  `);
};

export default class FormEditView extends AbstractStatefulView{

  constructor(point = BLANC_EVENT) {
    super();
    this._state = FormEditView.parsePointToState(point);

    this.#setInnerHandlers();
  }

  get template() {
    return createFormCreateTemplate(this._state);
  }

  reset = (point) => {
    this.updateElement(
      FormEditView.parsePointToState(point),
    );
  };

  static parsePointToState = (point) => ({
    ...point,
  });

  static parseStateToPoint = (state) => {
    const point = {...state};

    return point;
  };


  #setInnerHandlers = () => {
    Array.from(this.element.querySelectorAll('.event__type-input')).forEach((typeElement) => typeElement
      .addEventListener('click', this.#eventTypeToggleHandler)
    );
    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#eventDestinationInputHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  };

  #eventTypeToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: [],
    });
  };

  #priceInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      price: evt.target.value,
    });
  };

  #eventDestinationInputHandler = (evt) => {
    evt.preventDefault();
    if (evt.target.value) {
      this.updateElement({
        destination: evt.target.value,
      });
    }
  };

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(FormEditView.parseStateToPoint(this._state));
  };

  setEditClickHandler = (callback) => {
    this._callback.editClick = callback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#editClickHandler);

  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setEditClickHandler(this._callback.editClick);
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };

}
