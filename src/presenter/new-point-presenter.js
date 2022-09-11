import FormEditView from '../view/form-edit-view.js';
import {render, remove, RenderPosition} from '../framework/render';
import {UserAction, UpdateType} from '../const';
import {nanoid} from 'nanoid';

export default class NewPointPresenter {
  #pointListContainer = null;
  #formEditComponent = null;
  #changeData = null;
  #pointsModel = null;
  #destroyCallback = null;

  #task = null;

  constructor(pointListContainer, changeData, pointsModel) {
    this.#pointListContainer = pointListContainer;
    this.#changeData = changeData;
    this.#pointsModel = pointsModel;
  }

  init = (callback) => {
    this.#destroyCallback = callback;

    const destinations = [...this.#pointsModel.destinations];
    const offers = [...this.#pointsModel.offers];

    if (this.#formEditComponent !== null) {
      return;
    }


    this.#formEditComponent = new FormEditView(offers, destinations);

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
      this.#formEditComponent.reset(this.#task);
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
