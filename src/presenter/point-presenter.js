import FormEditView from '../view/form-edit-view.js';
import RoutePointView from '../view/route-point-view';
import {replace, render, remove} from '../framework/render';

const MODE = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null;
  #formEditComponent = null;
  #pointComponent = null;
  #changeMode = null;

  #task = null;
  #mode = MODE.DEFAULT;

  constructor(pointListContainer, changeMode) {
    this.#pointListContainer = pointListContainer;
    this.#changeMode = changeMode;
  }

  init = (task) => {
    this.#task = task;

    const prevTaskComponent = this.#pointComponent;
    const prevTaskEditComponent = this.#formEditComponent;

    this.#formEditComponent = new FormEditView(task);
    this.#pointComponent = new RoutePointView(task);


    this.#pointComponent.setOpenClickHandler(this.#handleEditClick);
    this.#formEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#formEditComponent.setEditClickHandler(this.#handleFormClose);


    if (prevTaskComponent === null || prevTaskEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === MODE.DEFAULT) {
      replace(this.#pointComponent, prevTaskComponent);
    }

    if (this.#mode === MODE.EDITING) {
      replace(this.#formEditComponent, prevTaskEditComponent);
    }

    remove(prevTaskComponent);
    remove(prevTaskEditComponent);
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#formEditComponent);
  };

  resetView = () => {
    if (this.#mode !== MODE.DEFAULT) {
      this.#formEditComponent.reset(this.#task);
      this.#replaceFormToRoute();
    }
  };

  #replaceRouteToForm = () => {
    replace(this.#formEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#changeMode();
    this.#mode = MODE.EDITING;
  };

  #replaceFormToRoute = () => {
    replace(this.#pointComponent, this.#formEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = MODE.DEFAULT;

  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#formEditComponent.reset(this.#task);
      this.#replaceFormToRoute();
    }
  };

  #handleEditClick = () => {
    this.#replaceRouteToForm();
  };

  #handleFormSubmit = () => {
    this.#replaceFormToRoute();
  };

  #handleFormClose = () => {
    this.#formEditComponent.reset(this.#task);
    this.#replaceFormToRoute();
  };
}
