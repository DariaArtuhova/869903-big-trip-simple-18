import ContentPresenter from './presenter/content-presenter.js';
import PointsModel from './model/model.js';
import {render} from './framework/render';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter.js';
import NewEventButtonView from './view/new-event-button-view';
import PointsApiService from './points-api-service';

const siteFilterElement = document.querySelector('.trip-main__trip-controls');
const siteContentWrapperElement = document.querySelector('.trip-events');
const siteButtonElement = document.querySelector('.trip-main');

const AUTHORIZATION = 'Basic fcbb55jl34';
const END_POINT = 'https://18.ecmascript.pages.academy/bg-trip';

const pointsModel = new PointsModel(new PointsApiService(END_POINT, AUTHORIZATION));
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

export const handleNewTaskButtonDisabled = () => {
  newTaskButtonComponent.element.disabled = true;
};

render(newTaskButtonComponent, siteButtonElement);
newTaskButtonComponent.setClickHandler(handleNewTaskButtonClick);


filterPresenter.init();
contentPresenter.init();
pointsModel.init()
  .finally(() => {
    newTaskButtonComponent.setClickHandler(handleNewTaskButtonClick);
    render(newTaskButtonComponent, siteButtonElement);
  });
