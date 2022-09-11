import ContentPresenter from './presenter/content-presenter.js';
import {remove, render} from './framework/render';
import FilterModel from './model/filter-model';
import FilterPresenter from './presenter/filter-presenter.js';
import NewEventButtonView from './view/new-event-button-view';
import PointsApiService from "./points-api-service";
import PointsModel from './model/model';


const AUTHORIZATION = 'Basic nlvnkf74ed733f';
const END_POINT = 'https://18.ecmascript.pages.academy/big-trip';

const siteFilterElement = document.querySelector('.trip-main__trip-controls');
const siteContentWrapperElement = document.querySelector('.trip-events');
const siteButtonElement = document.querySelector('.trip-main');

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

render(newTaskButtonComponent, siteButtonElement);
newTaskButtonComponent.setClickHandler(handleNewTaskButtonClick);

filterPresenter.init();
contentPresenter.init();
pointsModel.init();
