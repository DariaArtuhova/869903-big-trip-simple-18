import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {humanizeTaskDueDate} from '../utils/task';
import {DESTINATION_NAME, destinations, EVENT_TYPE} from '../fish/destination';
import {OFFERS} from '../fish/offers';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';


const createTypeEditTemplate = (currentType) => EVENT_TYPE.map((type) =>
  `<div class="event__type-item">
   <input id="event-type-${ type }" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${ currentType === 'checked' }>
   <label class="event__type-label  event__type-label--${ type }" for="event-type-${ type }">${ type }</label>
   </div>`).join('');

const editDestinationNamesListTemplate = () => (
  DESTINATION_NAME.map((name) =>
    `<option value="${ name }"></option>`));

const createFormCreateTemplate = (points) => {
  const {
    price,
    dateFrom,
    dateTo,
    type,
    destination,
    offers,
    destinationNameTemplate = destinations.find((el) => (el.id === destination)).name,
  } = points;

  const typeEditTemplate = createTypeEditTemplate(type);
  const destinationNameListTemplate = editDestinationNamesListTemplate(destination);
  const descriptionTemplate = destinations.map((el) => {
    if (destinationNameTemplate === null || destinationNameTemplate !== el.name){
      return null;
    }
    if (el.name === destinationNameTemplate){
      return el.description;
    }
  }).join('');


  const pointOfferType = OFFERS.filter((el) => (el.type === type));

  const PointOfferTemplate = pointOfferType.map((el) => {
    const checked = (offers === el.id) ? 'checked' : '';

    return ` <div class="event__offer-selector">
              <input class="event__offer-checkbox visually-hidden" id="event-offer-${ el.title }" type="checkbox" ${ checked } name="event-offer-${ el.title }">
              <label class="event__offer-label" for="event-offer-${ el.title }">
              <span class="event__offer-title"> ${ el.title } </span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price"> ${ el.price } </span>
              </div>`;
  }).join('');

  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${ type }.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${ typeEditTemplate }
                      </fieldset>
                    </div>
                  </div>
                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                    ${ type }
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" pattern="${DESTINATION_NAME.join('|' )} name="event-destination" value="${ destinationNameTemplate }" list="destination-list-1" >
                    <datalist id="destination-list-1">
                    ${ destinationNameListTemplate}
                    </datalist>
                  </div>
                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${ humanizeTaskDueDate(dateFrom) }">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${ humanizeTaskDueDate(dateTo) }">
                  </div>
                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="number" pattern="[0-9]+" name="event-price" value="${ price }">
                  </div>
                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                  <section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                    <div class="event__available-offers">
                    ${ PointOfferTemplate }
                      </div>
                    </div>
                  </section>
                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${ descriptionTemplate }</p>

                  </section>
                </section>
              </form>
            </li>`;
};

export default class FormEditView extends AbstractStatefulView {
  #datepicker = null;

  constructor(point = EVENT_TYPE) {
    super();

    this._state = FormEditView.parsePointToState(point);

    this.#setInnerHandlers();
  }

  get template() {
    return createFormCreateTemplate(this._state);
  }

  #datesChangeHandler = ([userDateFrom,userDateTo]) => {
    this.updateElement({
      dateFrom: userDateFrom,
      dateTo:userDateTo
    });
  };

  #setDatepicker = () => {
    this.#datepicker = flatpickr(
      this.element.querySelectorAll('.event__input--time'),
      {
        enableTime: true,
        mode: 'range',
        minDate: 'today',
        dateFormat: 'j/m/y / h:i',
        onChange: this.#datesChangeHandler,
      },
    );
  };

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

  #destinationToggleHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      destinationNameTemplate: evt.target.value,
    });
  };


  setEditClickHandler = (callback) => {
    const editClick = this.element.querySelector('.event__rollup-btn');

    if (editClick) {
      this._callback.editClick = callback;
      editClick.addEventListener('click', this.#editClickHandler);
    }
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.editClick();
  };

  #setInnerHandlers = () => {
    Array.from(this.element.querySelectorAll('.event__type-input')).forEach((typeElement) => typeElement
      .addEventListener('click', this.#eventTypeToggleHandler)
    );
    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationToggleHandler);

    this.#setDatepicker();
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


  setDeleteClickHandler = (callback) => {
    this._callback.deleteClick = callback;
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  };

  _restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setEditClickHandler(this._callback.editClick);
    this.#setDatepicker();
    this.setDeleteClickHandler(this._callback.deleteClick);
  };


  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(FormEditView.parseStateToPoint(this._state));
  };

}
