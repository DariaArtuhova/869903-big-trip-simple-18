import {SORT_TYPES, NO_TASKS, UpdateType, UserAction, FILTER_TYPES} from '../const';
import PointPresenter from './point-presenter';
import TripListView from '../view/trip-list-view.js';
import NoPointsView from '../view/no-points-view';
import SortView from '../view/sort-view';
import {render, RenderPosition, remove} from '../framework/render';
import {sortDate, sortPrice} from '../utils/sort';
import {filter} from '../utils/filter';
import NewPointPresenter from './new-point-presenter';


export default class ContentPresenter {
  #pointsModel = null;
  #mainContainer = null;
  #filterModel = null;
  #tripListComponent = new TripListView();

  #pointPresenter = new Map();

  #currentSortType = SORT_TYPES.day;

  #filterType = FILTER_TYPES.everything;

  #sortComponent = new SortView(this.#currentSortType);

  #noPointsBoard = null;

  #newPointPresenter = null;

  constructor(mainContainer, pointsModel, filterModel) {
    this.#mainContainer = mainContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#newPointPresenter = new NewPointPresenter(this.#tripListComponent.element, this.#handleViewAction, this.#pointsModel);


    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SORT_TYPES.day:
        return filteredPoints.sort(sortDate);
      case SORT_TYPES.price:
        return filteredPoints.sort(sortPrice);
    }

    return filteredPoints;
  }

  createPoint = (callback) => {
    this.#currentSortType = SORT_TYPES.day;
    this.#filterModel.setFilter(UpdateType.MAJOR, FILTER_TYPES.everything);
    this.#newPointPresenter.init(callback);
  };


  init = () => {
    this.#renderPoints();
    this.#renderSort();
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this.#pointsModel.updatePoint(updateType, update);
        this.#renderSort();
        break;
      case UserAction.ADD_TASK:
        this.#pointsModel.addPoint(updateType, update);
        this.#renderSort();
        break;
      case UserAction.DELETE_TASK:
        this.#pointsModel.deletePoint(updateType, update);
        this.#renderSort();
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderPoints();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderPoints();
        break;
    }
  };

  #renderTask = (task) => {
    const pointPresenter = new PointPresenter (this.#tripListComponent.element, this.#handleModeChange, this.#handleViewAction);
    pointPresenter.init(task);
    this.#pointPresenter.set(task.id, pointPresenter);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderSort();
    this.#renderPoints();
  };


  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#sortComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };


  #renderNoTask = () => {
    this.#noPointsBoard = new NoPointsView(this.#filterType);
    render(this.#noPointsBoard, this.#mainContainer, RenderPosition.AFTERBEGIN);
  };

  #clearBoard = ({resetSortType = false} = {}) => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#noPointsBoard);

    if (this.#noPointsBoard) {
      remove(this.#noPointsBoard);
    }

    if (resetSortType) {
      this.#currentSortType = SORT_TYPES.day;
    }
  };

  #renderPoints = () => {
    const points = this.points;
    const pointCount = points.length;

    render(this.#tripListComponent, this.#mainContainer);
    if (pointCount === NO_TASKS) {
      this.#renderNoTask();
      return;
    }
    for (let i = 0; i < pointCount; i++) {
      this.#renderTask(this.points[i]);
    }

  };

  #renderTripSection = () => {
    const points = this.points;
    const pointCount = points.length;

    if (!pointCount){
      this.#renderNoTask();
      return;
    }

    this.#renderSort();
    this.#renderNoTask();
  };
}
