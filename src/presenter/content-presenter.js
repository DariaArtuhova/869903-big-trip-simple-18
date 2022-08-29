import PointPresenter from './point-presenter';
import TripListView from '../view/trip-list-view.js';
import NoPointsView from '../view/no-points-view';
import {updateItem} from '../utils/common.js';
import {render} from '../framework/render';

export default class ContentPresenter {
  #pointsModel = null;
  #mainContainer = null;
  #tripListComponent = new TripListView();
  #boardTasks = [];

  #pointPresenter = new Map();

  constructor(mainContainer, pointsModel) {
    this.#mainContainer = mainContainer;
    this.#pointsModel = pointsModel;
  }


  init = () => {
    this.#boardTasks = [...this.#pointsModel.points];
    this.#renderPoints();
    this.#renderNoTask();
  };

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#boardTasks = updateItem(this.#boardTasks, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #renderTask = (task) => {
    const pointPresenter = new PointPresenter (this.#tripListComponent.element, this.#handleModeChange);
    pointPresenter.init(task);
    this.#pointPresenter.set(task.id, pointPresenter);
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
