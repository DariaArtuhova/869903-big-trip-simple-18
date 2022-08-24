import AbstractView from '../framework/view/abstract-view.js';

const createContentItemTemplate = (sort, isChecked) => {
  const {name} = sort;
  return (
    `
    <div class="trip-sort__item  trip-sort__item--${name}">
    <input id="sort-${name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${name}" ${isChecked ? 'checked' : ''}>
    <label class="trip-sort__btn" for="sort-${name}">${name}</label>
  </div>
  `
  );
};

const createNewSortTemplate = (sortItems) => {
  const sortItemsTemplate = sortItems
    .map((sort, index) => createContentItemTemplate(sort, index === 0))
    .join('');

  return `
  <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      ${sortItemsTemplate}
      </form>`;
};

export default class SortView extends AbstractView{

  #sorts = null;
  constructor(sorts) {
    super();
    this.#sorts = sorts;
  }

  get template() {
    return createNewSortTemplate(this.#sorts);
  }

}
