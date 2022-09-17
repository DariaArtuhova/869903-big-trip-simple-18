import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {humanizeTaskDueDate} from '../utils/task';
import flatpickr from 'flatpickr';
import {EVENT_TYPE} from '../const';
import 'flatpickr/dist/flatpickr.min.css';

export const BLANK_EVENT = {
  price: 0,
  dateFrom: new Date,
  dateTo: new Date,
  destinations: null,
  id: null,
  offers: [1, 2, 3, 4, 5, 6, 7],
  type: 'taxi'
};

const createOffersTemplate = (offers) => {

  const template = offers.reduce((prev, cur, index) => prev.concat(`
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${ index }" type="checkbox" name="event-offer-${ index }" checked>
      <label class="event__offer-label" for="event-offer-${ index }">
      <span class="event__offer-title">${ cur.title }</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${ cur.price }</span>
    </label>
  </div>`
  ), '');

  return `
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${ template }
    </div>
  </section>`;

};

const createDatalistTemplate = (destinations, destination) => {
  const firstTemplate = `<option value="${ destination ? destination.name : '' }" selected>${ destination ? destination.name : '' }</option>`;
  const secondTemplate = destinations
    .filter((it) => it.name !== destination)
    .reduce((prev, cur) => prev.concat(`<option value="${ cur.name }">${ cur.name }</option>`), '');
  const finalTemplate = firstTemplate + secondTemplate;
  return finalTemplate;
};

const createTypeEditTemplate = (currentType) => EVENT_TYPE.map((type) =>
  `<div class="event__type-item">
   <input id="event-type-${ type }" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${ currentType === 'checked' }>
   <label class="event__type-label  event__type-label--${ type }" for="event-type-${ type }">${ type }</label>
   </div>`).join('');

const createFormCreateTemplate = (pointModel, point) => {
  const {
    id,
    price,
    dateFrom,
    dateTo,
    type,
  } = point;

  const offersArray = pointModel.getOffersById(point);
  const destination = pointModel.getDestinationById(point.destination);

  const typeEditTemplate = createTypeEditTemplate(type);
  const destinations = [...pointModel.destinations];

  const buttonCloseTemplate = id
    ? `<button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Close event</span>
      </button>`
    : '';

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
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text"  name="event-destination" value="${ destination ? destination.name : '' }" list="destination-list-${destination ? destination.id : ''}" >
                    <datalist id="destination-list-${destination ? destination.id : ''}">
${ createDatalistTemplate(destinations, destination) }
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
                  <button class="event__reset-btn" type="reset">${id ? 'Delete' : 'Cancel'}</button>
                  ${buttonCloseTemplate}
                </header>
                <section class="event__details">

${ offersArray[0] ? createOffersTemplate(offersArray) : '' }
                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destination ? destination.description : '' }</p>

                  </section>
                </section>
              </form>
            </li>`;
};

export default class FormEditView extends AbstractStatefulView {
  #startDatepicker = null;
  #endDatepicker = null;
  #pointModel;

  constructor(pointModel, point = BLANK_EVENT) {
    super();
    this.#pointModel = pointModel;
    this._state = FormEditView.parsePointToState(point);

    this.#setInnerHandlers();
  }

  get template() {
    return createFormCreateTemplate(this.#pointModel, this._state);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#startDatepicker) {
      this.#startDatepicker.destroy();
      this.#startDatepicker = null;
    }

    if (this.#endDatepicker) {
      this.#endDatepicker.destroy();
      this.#endDatepicker = null;
    }
  };

  #startDateChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #endDateChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #setStartDatepicker = () => {
    this.#startDatepicker = flatpickr(
      this.element.querySelector('#event-start-time-1'),
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onClose: this.#startDateChangeHandler,
      }
    );
  };

  #setEndDatepicker = () => {
    this.#endDatepicker = flatpickr(
      this.element.querySelector('#event-end-time-1'),
      {
        enableTime: true,
        'time_24hr': true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onClose: this.#endDateChangeHandler,
      }
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

  #eventDestinationInputHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      destination: this.#pointModel.getIdByDestination(evt.target.value)
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

    this.element.querySelector('.event__type-group')
      .addEventListener('click', this.#eventTypeToggleHandler);

    this.element.querySelector('.event__input--price')
      .addEventListener('input', this.#priceInputHandler);

    this.element.querySelector('.event__input--destination')
      .addEventListener('change', this.#eventDestinationInputHandler);
  };


  #eventTypeToggleHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      this.updateElement({
        type: evt.target.value
      });
    }
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
    this.#setStartDatepicker();
    this.#setEndDatepicker();
    this.setDeleteClickHandler(this._callback.deleteClick);
  };


  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(FormEditView.parseStateToPoint(this._state));
  };

}
