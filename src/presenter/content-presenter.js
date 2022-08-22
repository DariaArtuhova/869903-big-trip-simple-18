import SortView from '../view/sort-view.js';
import FormEditView from '../view/form-edit-view.js';
import TripListView from '../view/trip-list-view.js';
import RoutePointView from '../view/route-point-view';
import NoPointsView from '../view/no-points-view';
import {render} from '../render.js';

export default class ContentPresenter {
  #pointsModel = null;
  #sortFormComponent = new SortView();
  #tripListComponent = new TripListView();
  #boardTasks = [];


  init = (mainContainer, pointsModel) => {
    this.#pointsModel = pointsModel;
    this.#boardTasks = [...this.#pointsModel.points];

    if (this.#boardTasks.every((task) => task.isArchive)) {
      render(new NoPointsView(), mainContainer);
    } else {
      render(this.#sortFormComponent, mainContainer);
      render(this.#tripListComponent, mainContainer);

      for (let i = 0; i < this.#boardTasks.length; i++) {
        this.#renderTask(this.#boardTasks[i]);
      }
    }
  };

  #renderTask = (point, offers) => {
    const pointComponent = new RoutePointView(point, offers);
    const formEditView = new FormEditView(point, offers);

    const openFormEdit = () => {
      this.#tripListComponent.element.replaceChild(formEditView.element, pointComponent.element);
    };

    const openRoutePoint = () => {
      this.#tripListComponent.element.replaceChild(pointComponent.element, formEditView.element);
    };

    const onEscKeyDown = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        openRoutePoint();
        document.removeEventListener('keydown', onEscKeyDown);
      }
    };

    pointComponent.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      openFormEdit();
      document.addEventListener('keydown', onEscKeyDown);
    });

    formEditView.element.querySelector('.event--edit').addEventListener('submit', (evt) => {
      evt.preventDefault();
      openRoutePoint();
      document.addEventListener('keydown', onEscKeyDown);
    });

    formEditView.element.querySelector('.event__rollup-btn').addEventListener('click', () => {
      openRoutePoint();
    });

    render(pointComponent, this.#tripListComponent.element);
  };

}
