import ContentPresenter from './presenter/content-presenter.js';
import PointsModel from './model/model.js';
import {render} from './framework/render';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter.js';
import NewEventButtonView from './view/new-event-button-view';

const siteFilterElement = document.querySelector('.trip-main__trip-controls');
const siteContentWrapperElement = document.querySelector('.trip-events');
const siteButtonElement = document.querySelector('.trip-main');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const contentPresenter = new ContentPresenter(siteContentWrapperElement, pointsModel, filterModel);
const filterPresenter = new FilterPresenter(siteFilterElement, filterModel, pointsModel);
const newTaskButtonComponent = new NewEventButtonView();

const handleNewTaskFormClose = () => {
  newTaskButtonComponent.element.disabled = false;
};

const handleNewTaskButtonClick = () => {
  contentPresenter.createPoint(handleNewTaskFormClose);
  newTaskButtonComponent.element.disabled = true;
};

render(newTaskButtonComponent, siteButtonElement);
newTaskButtonComponent.setClickHandler(handleNewTaskButtonClick);


filterPresenter.init();
contentPresenter.init();
