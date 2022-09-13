import AbstractView from '../framework/view/abstract-view.js';

const createContentItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;
  return (`
<div class="trip-filters__filter">
  <input
  id="filter-${name}"
  class="trip-filters__filter-input  visually-hidden"
  type="radio"
  name="trip-filter"
  value="${type}"
  ${type === currentFilterType ? 'checked' : ''}
  ${count === 0 ? 'disabled' : ''}
  >
  <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
</div>
  `);
};

const createNewFilterTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createContentItemTemplate(filter, currentFilterType))
    .join('');

  return `
    <form class="trip-filters" action="#" method="get">
      ${filterItemsTemplate}
      </form>`;

};

export default class FiltersView extends AbstractView{
  #currentFilterType = null;
  #filters = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilterType = currentFilterType;
  }

  get template() {
    return createNewFilterTemplate(this.#filters, this.#currentFilterType);
  }

  setFilterTypeChangeHandler = (callback) => {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  };

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  };


}
