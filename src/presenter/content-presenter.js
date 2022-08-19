import SortView from '../view/sort-view.js';
import FormEditView from '../view/form-edit-view.js';
import FormCreateView from '../view/form-create-view.js';
import TripListView from '../view/trip-list-view.js';
import RoutePointView from '../view/route-point-view';
import {render} from '../render.js';

export default class ContentPresenter {
  sortFormComponent = new SortView();
  tripListComponent = new TripListView();
  formCreateView = new FormCreateView();

  init = (mainContainer, pointsModel) => {
    this.pointsModel = pointsModel;
    this.boardTasks = [...this.pointsModel.getPoints()];

    render(this.sortFormComponent, mainContainer);
    render(this.tripListComponent, mainContainer);
    render(new FormEditView(this.boardTasks[0]), this.tripListComponent.getElement());
    render(new RoutePointView(this.boardTasks[0]), this.tripListComponent.getElement());
    render(this.formCreateView, this.tripListComponent.getElement());

    for (let i = 0; i < this.boardTasks.length; i++) {
      render(new FormEditView(this.boardTasks[i]), this.tripListComponent.getElement());
      render(new RoutePointView(this.boardTasks[i]), this.tripListComponent.getElement());
    }
  };

}
