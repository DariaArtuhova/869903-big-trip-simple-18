import {SORT_TYPES, NO_TASKS, UpdateType, UserAction, FILTER_TYPES} from '../const';
import PointPresenter from './point-presenter';
import TripListView from '../view/trip-list-view.js';
import NoPointsView from '../view/no-points-view';
import SortView from '../view/sort-view';
import {render, RenderPosition, remove} from '../framework/render';
import {sortDate, sortPrice} from '../utils/sort';
import {filter} from '../utils/filter';
import NewPointPresenter from './new-point-presenter';
import LoadingView from '../view/loading-view';


export default class ContentPresenter {
  #pointsModel = null;
  #mainContainer = null;
  #filterModel = null;
  #currentSortType = SORT_TYPES.day;
  #filterType = FILTER_TYPES.everything;

  #loadingComponent = new LoadingView();
  #tripListComponent = new TripListView();
  #sortComponent = new SortView(this.#currentSortType);
  #pointPresenter = new Map();

  #isLoading = true;

  #noPointsBoard = null;

  #newPointPresenter = null;

  constructor(mainContainer, pointsModel, filterModel) {
    this.#mainContainer = mainContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#newPointPresenter = new NewPointPresenter(this.#tripListComponent, this.#handleViewAction, this.#pointsModel);


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
        this.#pointPresenter.get(data.id).init(data, this.#pointsModel);
        break;
      case UpdateType.MINOR:
        this.#clearBoard();
        this.#renderPoints();
        break;
      case UpdateType.MAJOR:
        this.#clearBoard({resetSortType: true});
        this.#renderPoints();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderPoints();
        break;
    }
  };

  #renderTask = (task) => {
    const pointPresenter = new PointPresenter (this.#tripListComponent, this.#handleViewAction, this.#handleModeChange);
    pointPresenter.init(task, this.#pointsModel);
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

  #renderLoading = () => {
    render(this.#loadingComponent, this.#tripListComponent.element, RenderPosition.AFTERBEGIN);
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
    remove(this.#loadingComponent);
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

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (pointCount === NO_TASKS) {
      this.#renderNoTask();
      return;
    }
    for (let i = 0; i < pointCount; i++) {
      this.#renderTask(this.points[i]);
    }
  };
}
