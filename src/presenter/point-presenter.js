import FormEditView from '../view/form-edit-view.js';
import RoutePointView from '../view/route-point-view';
import {replace, render, remove} from '../framework/render';
import {UserAction, UpdateType} from '../const';

const MODE = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null;
  #formEditComponent = null;
  #pointComponent = null;
  #changeMode = null;
  #changeData = null;

  #point = null;
  #mode = MODE.DEFAULT;

  constructor(pointListContainer, changeMode, changeData) {
    this.#pointListContainer = pointListContainer;
    this.#changeMode = changeMode;
    this.#changeData = changeData;

  }

  init = (point) => {
    this.#point = point;

    const prevTaskComponent = this.#pointComponent;
    const prevTaskEditComponent = this.#formEditComponent;

    this.#formEditComponent = new FormEditView(point);
    this.#pointComponent = new RoutePointView(point);


    this.#pointComponent.setOpenClickHandler(this.#handleEditClick);
    this.#formEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#formEditComponent.setEditClickHandler(this.#handleFormClose);
    this.#formEditComponent.setDeleteClickHandler(this.#handleFormDelete);


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
      this.#formEditComponent.reset(this.#point);
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
      this.#formEditComponent.reset(this.#point);
      this.#replaceFormToRoute();
    }
  };

  #handleEditClick = () => {
    this.#replaceRouteToForm();
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.UPDATE_TASK,
      UpdateType.MINOR,
      point,
    );
    this.#replaceFormToRoute();
  };

  #handleFormDelete = (trip) => {
    this.#changeData(
      UserAction.DELETE_TASK,
      UpdateType.MINOR,
      trip,
    );
  };

  #handleFormClose = () => {
    this.#formEditComponent.reset(this.#point);
    this.#replaceFormToRoute();
  };
}
