import SortView from '../view/sort-view.js';
import FormEditView from '../view/form-edit-view.js';
import TripListView from '../view/trip-list-view.js';
import RoutePointView from '../view/route-point-view';
import NoPointsView from '../view/no-points-view';
import {render} from '../framework/render';

export default class ContentPresenter {
  #pointsModel = null;
  #mainContainer = null;
  #sortFormComponent = new SortView();
  #tripListComponent = new TripListView();
  #boardTasks = [];

  constructor(mainContainer, pointsModel) {
    this.#mainContainer = mainContainer;
    this.#pointsModel = pointsModel;
  }


  init = () => {
    this.#boardTasks = [...this.#pointsModel.points];
    this.#renderBoard();
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

    pointComponent.setOpenClickHandler(() => {
      openFormEdit();
      document.addEventListener('keydown', onEscKeyDown);
    });

    formEditView.setFormSubmitHandler(() => {
      openRoutePoint();
      document.addEventListener('keydown', onEscKeyDown);
    });

    formEditView.setOpenClickHandler(() => {
      openRoutePoint();
    });

    render(pointComponent, this.#tripListComponent.element);
  };

  #renderBoard = () => {
    render(this.#tripListComponent, this.#mainContainer);
    if (this.#boardTasks.every((task) => task.isArchive)) {
      render(new NoPointsView(), this.#mainContainer);
    } else {
      render(this.#sortFormComponent, this.#mainContainer);
      render(this.#tripListComponent, this.#mainContainer);

      for (let i = 0; i < this.#boardTasks.length; i++) {
        this.#renderTask(this.#boardTasks[i]);
      }
    }
  };
}
