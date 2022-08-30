import FiltersView from './view/filters-view.js';
import ContentPresenter from './presenter/content-presenter.js';
import PointsModel from './model/model.js';
import {generateFilter} from './fish/filter';
import {render} from './framework/render';

const siteFilterElement = document.querySelector('.trip-controls__filters');
const siteContentWrapperElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const contentPresenter = new ContentPresenter(siteContentWrapperElement, pointsModel);

const filters = generateFilter(pointsModel.points);

render(new FiltersView(filters), siteFilterElement);

contentPresenter.init();
