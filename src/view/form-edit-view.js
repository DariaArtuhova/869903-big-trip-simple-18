import AbstractStatefulView from '../framework/view/abstract-stateful-view';
import {humanizeTaskDueDate} from '../utils/task';
import flatpickr from 'flatpickr';
import {EVENT_TYPE} from '../const';
import 'flatpickr/dist/flatpickr.min.css';

export const BLANK_EVENT = {
  price: 0,
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: 1,
  isFavorite: false,
  offers: [],
  type: 'taxi'
};

const createOffersTemplate = (offersByType, checkedOffers) => {

  const isChecked = (offer) => checkedOffers.includes(offer.id);

  const allOffersTemplate = offersByType
    .map((offer) => (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox visually-hidden" id="event-offer-${ offer.id }" type="checkbox" name="event-offer-${ offer.id }" ${ isChecked(offer) ? 'checked' : '' }>
          <label class="event__offer-label" for="event-offer-${ offer.id }">
          <span class="event__offer-title">${ offer.title }</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${ offer.price }</span>
        </label>
      </div>`
    ))
    .join('');

  return `
  <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${ allOffersTemplate }
    </div>
  </section>`;

};

const createDatalistTemplate = (destinations, destination) => {
  const template = destinations
    .filter((it) => it.name !== destination)
    .reduce((prev, cur) => prev.concat(`<option value="${ cur.name }">${ cur.name }</option>`), '');
  return template;
};

const createTypeEditTemplate = (currentType) => EVENT_TYPE.map((type) =>
  `<div class="event__type-item">
   <input id="event-type-${ type }" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${ currentType === 'checked' }>
   <label class="event__type-label  event__type-label--${ type }" for="event-type-${ type }">${ type }</label>
   </div>`).join('');

const createFormCreateTemplate = (pointModel, point) => {
  const {
    id,
    dateFrom,
    dateTo,
    price,
    type,
    offers,
    isDisabled,
    isSaving,
    isDeleting,
  } = point;

  const isSubmitDisabled = isDisabled | !dateFrom | !dateTo | !type;

  const allOffersByType = pointModel.getAllOffersByType(point);
  const destination = pointModel.getDestinationById(point.destination);

  const typeEditTemplate = createTypeEditTemplate(type);
  const destinations = [...pointModel.destinations];

  const buttonCloseTemplate = id
    ? `<button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Close event</span>
      </button>`
    : '';

  const buttonResetTemplate = id
    ? `<button class="event__reset-btn" type="reset">${isDeleting ? 'Deleting...' : 'Delete'}</button>`
    : '<button class="event__reset-btn" type="reset">Cancel</button>';

  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post" ${isDisabled ? 'disabled' : ''}>
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
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text"  name="event-destination" value="${ destination ? destination.name : '' }" list="destination-list-1" >
                    <datalist id="destination-list-1">
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
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price ? price : ''}">
                  </div>
<button class="event__save-btn btn btn--blue" type="submit" ${isSubmitDisabled ? 'disabled' : ''}>
            ${isSaving ? 'Saving...' : 'Save'}
          </button>
          ${buttonResetTemplate}
                  ${buttonCloseTemplate}
                </header>
                <section class="event__details">

              ${ allOffersByType[0] ? createOffersTemplate(allOffersByType, offers) : '' }
                  <section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destination ? destination.description : '' }</p>

                  </section>
                </section>
              </form>
            </li>`;
};

export default class FormEditView extends AbstractStatefulView {
  #pointModel;
  #startDatepicker = null;
  #endDatepicker = null;
  #offers = null;

  constructor(pointModel, point = BLANK_EVENT) {
    super();
    this.#pointModel = pointModel;
    this._state = FormEditView.parsePointToState(point);

    this.#setInnerHandlers();
    this.#offers = new Set(this._state.offers);

  }

  get template() {
    return createFormCreateTemplate(this.#pointModel, this._state, this.#offers);
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

  #setDatepicker = () => {
    this.#startDatepicker = flatpickr(
      this.element.querySelector('[name = "event-start-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateFrom,
        onChange: this.#dueDateFromChangeHandler,
        enableTime: true,
        'time_24hr': true,
      },
    );

    this.#endDatepicker = flatpickr(
      this.element.querySelector('[name = "event-end-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        defaultDate: this._state.dateTo,
        onChange: this.#dueDateToChangeHandler,
        enableTime: true,
        'time_24hr': true,
      },
    );
  };

  #dueDateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate?.toISOString(),
    });
  };

  #dueDateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate?.toISOString(),
    });
  };

  reset = (point) => {
    this.updateElement(
      FormEditView.parsePointToState(point),
    );
  };

  static parsePointToState = (point) => ({
    ...point,
    isDisabled: false,
    isSaving: false,
    isDeleting: false,
  });

  static parseStateToPoint = (state) => {
    const point = {...state};

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

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

    this.element.querySelector('.event__details')
      .addEventListener('change', this.#formOfferClickHandler);


    this.#setDatepicker();
  };


  #eventTypeToggleHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      this.#offers.clear();
      this.updateElement({
        type: evt.target.value,
        offers: []
      });
    }
  };

  #formOfferClickHandler = (evt) => {
    if (evt.target.tagName === 'INPUT') {
      const pointId = evt.target.id;
      const id = parseInt(pointId.match(/\d+/), 10);

      if (this.#offers.has(id)) {
        this.#offers.delete(id);
        this._setState({
          offers: Array.from(this.#offers)
        });
      } else {
        this._setState({
          offers: Array.from(this.#offers.add(id))
        });
      }
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
    this.#setDatepicker();
    this.setDeleteClickHandler(this._callback.deleteClick);
  };


  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this._callback.deleteClick(FormEditView.parseStateToPoint(this._state));
  };

}
