import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {DESTINATION_NAME, destinations, EVENT_TYPE} from '../fish/destination.js';
import {humanizeTaskDueDate} from '../utils/task';
import {OFFERS} from '../fish/offers';
import flatpickr from 'flatpickr';

const createTypeTemplate = (currentType) => EVENT_TYPE.map((type) =>
  `<div class="event__type-item">
   <input id="event-type-${ type }" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${ type }" ${ currentType === 'checked' }>
   <label class="event__type-label  event__type-label--${ type }" for="event-type-${ type }">${ type }</label>
   </div>`).join('');

const createDestinationNamesListTemplate = () => (
  DESTINATION_NAME.map((name) =>
    `<option value="${ name }"></option>`));

const createNewFormTemplate = (points) => {
  const {
    price,
    dateFrom,
    dateTo,
    type,
    destination,
    offers,
    destinationNameTemplate,
    isDisabled,
  } = points;

  const typeTemplate = createTypeTemplate(type);
  const destinationNameListTemplate = createDestinationNamesListTemplate(destination);

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
    const checked = (offers === el.id ) ? 'checked' : '';

    return ` <div class="event__offer-selector">
              <input class="event__offer-checkbox visually-hidden" id="event-offer-luggage-1" type="checkbox" ${ checked } name="event-offer-luggage">
              <label class="event__offer-label" for="event-offer-luggage-1">
              <span class="event__offer-title"> ${ el.title } </span>
              &plus;&euro;&nbsp;
              <span class="event__offer-price"> ${ el.price } </span>
              </div>`;
  }).join('');

  const icon = type
    ? `<img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">`
    : '';

  const isSubmitDisabled = isDisabled | !type | !destinationNameTemplate ;


  return (
    `<li class="trip-events__item">
     <form class="event event--edit" action="#" method="post">
      <header class="event__header">
     <div class="event__type-wrapper">
      <label class="event__type  event__type-btn" for="event-type-toggle-1">
        <span class="visually-hidden">Choose event type</span>
${icon}      </label>
      <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
      <div class="event__type-list">
        <fieldset class="event__type-group">
          <legend class="visually-hidden">Event type</legend>
         ${ typeTemplate ? typeTemplate : '' }
        </fieldset>
      </div>
    </div>
    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
      ${ type ? type : '' }
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" pattern="${ DESTINATION_NAME.join('|')} "type="text" name="event-destination" value='${destinationNameTemplate ? destinationNameTemplate : '' }' list="destination-list-1">
      <datalist id="destination-list-1">
      ${ destinationNameListTemplate }
      </datalist>
    </div>
    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value= "${ humanizeTaskDueDate(dateFrom) }">
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${ humanizeTaskDueDate(dateTo) }">
    </div>
    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-1">
        <span class="visually-hidden">Price</span>
        ${ price ? price : '' } &euro;
      </label>
      <input class="event__input  event__input--price" pattern="[0-9]+" id="event-price-1" type="number" name="event-price" value="">
    </div>
    <button class="event__save-btn  btn  btn--blue" type="submit" ${isSubmitDisabled ? 'disabled' : ''}>Save</button>
    <button class="event__reset-btn" type="reset">Cancel</button>
  </header>
  <section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${PointOfferTemplate}
    </section>
    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${ descriptionTemplate }</p>
      </div>
    </section>
  </section>
</form>
</li>`);
};

export default class FormCreateView extends AbstractStatefulView{
  #datepicker = null;

  constructor(point = EVENT_TYPE) {
    super();

    this._state = FormCreateView.parsePointToState(point);

    this.#setInnerHandlers();
  }

  get template() {
    return createNewFormTemplate(this._state);
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
      FormCreateView.parsePointToState(point),
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

  setFormSubmitHandler = (callback) => {
    this._callback.formSubmit = callback;
    this.element.querySelector('.event--edit').addEventListener('submit', this.#formSubmitHandler);
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this._callback.formSubmit(FormCreateView.parseStateToPoint(this._state));
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
    this._callback.deleteClick(FormCreateView.parseStateToPoint(this._state));
  };

}
