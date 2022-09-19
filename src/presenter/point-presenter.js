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
  #pointModel;
  #point = null;
  #mode = MODE.DEFAULT;

  constructor(pointModel, pointListContainer, changeMode, changeData) {
    this.#pointModel = pointModel;
    this.#pointListContainer = pointListContainer;
    this.#changeMode = changeMode;
    this.#changeData = changeData;

  }

  init = (point) => {
    this.#point = point;

    const prevTaskComponent = this.#pointComponent;
    const prevTaskEditComponent = this.#formEditComponent;

    this.#formEditComponent = new FormEditView(this.#pointModel, this.#point);
    this.#pointComponent = new RoutePointView(this.#pointModel, this.#point);


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
      this.#mode = MODE.DEFAULT;
    }

    remove(prevTaskComponent);
    remove(prevTaskEditComponent);
  };

  destroy = () => {
    remove(this.#pointComponent);
    remove(this.#formEditComponent);
  };

  setSaving = () => {
    if (this.#mode === MODE.EDITING) {
      this.#formEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  };

  setDeleting = () => {
    if (this.#mode === MODE.EDITING) {
      this.#formEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  };

  setAborting = () => {
    if (this.#mode === MODE.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#formEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#formEditComponent.shake(resetFormState);
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
  };

  #handleFormDelete = (point) => {
    this.#changeData(
      UserAction.DELETE_TASK,
      UpdateType.MINOR,
      point,
    );
  };

  #handleFormClose = () => {
    this.#formEditComponent.reset(this.#point);
    this.#replaceFormToRoute();
  };
}
