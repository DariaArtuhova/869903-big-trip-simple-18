import {render, remove, RenderPosition} from '../framework/render';
import {UserAction, UpdateType} from '../const';
import {nanoid} from 'nanoid';
import FormEditView from '../view/form-edit-view';

export default class NewPointPresenter {
  #pointModel;

  #pointListContainer = null;
  #formEditComponent = null;
  #changeData = null;
  #destroyCallback = null;

  constructor(pointListContainer, changeData, pointModel) {
    this.#pointModel = pointModel;

    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    if (this.#formEditComponent !== null) {
      return;
    }


    this.#formEditComponent = new FormEditView(this.#pointModel);

    this.#formEditComponent.setFormSubmitHandler(this.#handleFormSubmit);
    this.#formEditComponent.setDeleteClickHandler(this.#handleFormClose);


    render(this.#formEditComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);
    document.addEventListener('keydown', this.#escKeyDownHandler);
  };

  destroy = () => {
    if (!this.#formEditComponent) {
      return;
    }

    this.#destroyCallback?.();

    remove(this.#formEditComponent);
    this.#formEditComponent = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  };


  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };

  #handleFormSubmit = (point) => {
    this.#changeData(
      UserAction.ADD_TASK,
      UpdateType.MINOR,
      {id: nanoid(), ...point},
    );
    this.destroy();
  };

  #handleFormClose = () => {
    this.destroy();
  };
}
