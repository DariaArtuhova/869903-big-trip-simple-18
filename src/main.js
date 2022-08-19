import FiltersView from './view/filters-view.js';
import ContentPresenter from './presenter/content-presenter.js';
import PointsModel from './model/model.js';
import {render} from './render.js';

const siteFilterElement = document.querySelector('.trip-controls__filters');
const siteContentWrapperElement = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const contentPresenter = new ContentPresenter();

render(new FiltersView(), siteFilterElement);

contentPresenter.init(siteContentWrapperElement, pointsModel);
