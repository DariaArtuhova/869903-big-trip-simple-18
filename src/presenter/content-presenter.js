import {SORT_TYPES, NO_TASKS, UpdateType, UserAction, FILTER_TYPES} from '../const';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import PointPresenter from './point-presenter';
import TripListView from '../view/trip-list-view.js';
import NoPointsView from '../view/no-points-view';
import SortView from '../view/sort-view';
import {render, RenderPosition, remove} from '../framework/render';
import {sortDate, sortPrice} from '../utils/sort';
import {filter} from '../utils/filter';
import NewPointPresenter from './new-point-presenter';
import LoadingView from '../view/loading-view';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class ContentPresenter {
  #pointsModel;
  #mainContainer;
  #filterModel;
  #tripListComponent = new TripListView();
  #loadingComponent = new LoadingView();

  #pointPresenter = new Map();

  #currentSortType = SORT_TYPES.day;

  #filterType = FILTER_TYPES.everything;

  #sortComponent = new SortView(this.#currentSortType);

  #noPointsBoard = null;

  #newPointPresenter;

  #isLoading = true;

  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);

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
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #renderPoint = (point) => {
    const pointPresenter = new PointPresenter (this.#pointsModel, this.#tripListComponent.element, this.#handleModeChange, this.#handleViewAction);
    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_TASK:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_TASK:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_TASK:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderPoints();
        break;
    }
  };

  #renderLoading = () => {
    render(this.#loadingComponent, this.#tripListComponent.element, RenderPosition.AFTERBEGIN);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearBoard();
    this.#renderPoints();
  };


  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
    render(this.#sortComponent, this.#mainContainer, RenderPosition.BEFOREBEGIN);
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
    render(this.#tripListComponent, this.#mainContainer);

    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const points = this.points;
    const pointCount = points.length;

    if (pointCount === NO_TASKS) {
      this.#renderNoTask();
      return;
    }

    for (let i = 0; i < pointCount; i++) {
      this.#renderPoint(this.points[i]);
    }

    this.#renderSort();
  };
}
