import AbstractView from '../framework/view/abstract-view.js';

const createNewFilterTemplate = () => ('              <form class="trip-filters" action="#" method="get">\n' +
  '                <div class="trip-filters__filter">\n' +
  '                  <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything">\n' +
  '                  <label class="trip-filters__filter-label" for="filter-everything">Everything</label>\n' +
  '                </div>\n' +
  '\n' +
  '                <div class="trip-filters__filter">\n' +
  '                  <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future">\n' +
  '                  <label class="trip-filters__filter-label" for="filter-future">Future</label>\n' +
  '                </div>\n' +
  '\n' +
  '                <button class="visually-hidden" type="submit">Accept filter</button>\n' +
  '              </form>\n');

export default class FiltersView extends AbstractView{

  get template() {
    return createNewFilterTemplate();
  }

}
