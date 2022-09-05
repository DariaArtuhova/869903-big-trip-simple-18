import {SORT_TYPES} from '../const';
import PointPresenter from './point-presenter';
import TripListView from '../view/trip-list-view.js';
import NoPointsView from '../view/no-points-view';
import SortView from '../view/sort-view';
import {updateItem} from '../utils/common.js';
import {render, RenderPosition, remove} from '../framework/render';
import {sortDate, sortPrice} from '../utils/sort';

export default class ContentPresenter {
  #pointsModel = null;
  #mainContainer = null;
  #tripListComponent = new TripListView();
  #boardTasks = [];

  #pointPresenter = new Map();

  #currentSortType = SORT_TYPES.day;
  #sourcedBoardTasks = [];

  #sortComponent = new SortView(this.#currentSortType);

  constructor(mainContainer, pointsModel) {
    this.#mainContainer = mainContainer;
    this.#pointsModel = pointsModel;
  }


  init = () => {
    this.#boardTasks = [...this.#pointsModel.points];
    this.#sourcedBoardTasks = [...this.#pointsModel.points];
    this.#renderPoints();
    this.#renderNoTask();
    this.#renderSort();
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#boardTasks = updateItem(this.#boardTasks, updatedPoint);
    this.#sourcedBoardTasks = updateItem(this.#sourcedBoardTasks, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #sortTasks = (sortType) => {
    switch (sortType) {
      case SORT_TYPES.day:
        this.#boardTasks.sort(sortDate);
        break;
      case SORT_TYPES.price:
        this.#boardTasks.sort(sortPrice);
        break;
      default:

        this.#boardTasks = [...this.#sourcedBoardTasks];
    }

    this.#currentSortType = sortType;
  };

  #renderTask = (task) => {
    const pointPresenter = new PointPresenter (this.#tripListComponent.element, this.#handleModeChange, this.#handlePointChange);
    pointPresenter.init(task);
    this.#pointPresenter.set(task.id, pointPresenter);
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortTasks(sortType);
    this.#clearSort();
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#renderSort();
    this.#clearTaskList();
    this.#renderPoints();
  };

  #clearSort = () => {
    remove(this.#sortComponent);
  };

  #renderSort = () => {
    render(this.#sortComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
    this.#sortComponent.setSortTypeChangeHandler(this.#handleSortTypeChange);
  };

  #clearTaskList = () => {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  };

  #renderNoTask = () => {
    render(this.#tripListComponent, this.#mainContainer);
    if (this.#boardTasks.every((task) => task.isArchive)) {
      render(new NoPointsView(), this.#mainContainer);
    }
  };

  #renderPoints = () => {
    render(this.#tripListComponent, this.#mainContainer);
    for (let i = 0; i < this.#boardTasks.length; i++) {
      this.#renderTask(this.#boardTasks[i]);
    }
  };
}
