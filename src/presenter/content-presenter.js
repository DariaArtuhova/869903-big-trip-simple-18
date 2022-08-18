import SortView from '../view/sort-view.js';
import FormCreateView from '../view/form-create-view.js';
import FormEditView from '../view/form-edit-view.js';
import TripListView from '../view/trip-list-view.js';
import RoutePointView from '../view/route-point-view';
import {render} from '../render.js';

const ROUTE_POINT_AMOUNT = 3;

export default class ContentPresenter {
  sortFormComponent = new SortView();
  tripFormAddComponent = new FormCreateView();
  tripFormEditComponent = new FormEditView();
  tripListComponent = new TripListView();

  init = (mainContainer) => {
    render(this.sortFormComponent, mainContainer);
    render(this.tripListComponent, mainContainer);
    render(this.tripFormAddComponent, this.tripListComponent.getElement());
    render(this.tripFormEditComponent, this.tripListComponent.getElement());

    for(let i = 0; i < ROUTE_POINT_AMOUNT; i++) {
      render(new RoutePointView(), this.tripListComponent.getElement());
    }
  };

}
