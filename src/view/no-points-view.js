import AbstractView from '../framework/view/abstract-view.js';
import {FILTER_TYPES} from '../const';

const NoTasksTextType = {
  [FILTER_TYPES.everything]: 'Click New Event to create your first point',
  [FILTER_TYPES.past]: 'There are no past events now',
  [FILTER_TYPES.future]: 'There are no future events now',
};

const createNoPointsTemplate = (filterType) => {
  const noTaskTextValue = NoTasksTextType[filterType];

  return (
    `
<p class="trip-events__msg">
      ${noTaskTextValue}
    </p>`);
};

export default class NoPointsView extends AbstractView{
  #filterType = null;

  constructor(filterType) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointsTemplate(this.#filterType);
  }

}
