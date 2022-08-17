import SortView from '../view/sort-view.js';
import FormView from '../view/form-create-view.js';
import FormEditView from '../view/form-edit-view.js';
import TripListView from '../view/trip-list-view.js';
import RoutePointView from '../view/route-point-view';
import {render} from '../render.js';

export default class ContentPresenter {
  sortFormComponent = new SortView();
  tripFormAddComponent = new FormView();
  tripFormEditComponent = new FormEditView();
  tripListComponent = new TripListView();

  init = (mainContainer) => {
    render(this.sortFormComponent, mainContainer);
    render(this.tripListComponent, mainContainer);
    render(this.tripFormAddComponent, this.tripListComponent.getElement());
    render(this.tripFormEditComponent, this.tripListComponent.getElement());

    for(let i = 0; i < 3; i++) {
      render(new RoutePointView(), this.tripListComponent.getElement());
    }
  };

}