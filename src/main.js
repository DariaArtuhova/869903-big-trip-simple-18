import FiltersView from './view/filters-view.js';
import ContentPresenter from './presenter/content-presenter.js';
import PointsModel from './model/model.js';
import {generateFilter} from './fish/filter';
import {generateSort} from './fish/sort';
import SortView from './view/sort-view';
import {render} from './framework/render';

const siteFilterElement = document.querySelector('.trip-controls__filters');
const siteContentWrapperElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const contentPresenter = new ContentPresenter(siteContentWrapperElement, pointsModel);

const filters = generateFilter(pointsModel.points);

const sort = generateSort(pointsModel.points);

render(new SortView(sort), siteContentWrapperElement);

render(new FiltersView(filters), siteFilterElement);

contentPresenter.init();
