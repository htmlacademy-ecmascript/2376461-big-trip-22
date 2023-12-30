import {render,RenderPosition} from '../framework/render.js';

import InfoView from '../view/info-view.js';

export default class InfoPresenter {

  constructor({mainContainer,pointsModel}) {
    this.mainContainer = mainContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.pointsData = [...this.pointsModel.getPoints()];

    render(new InfoView({ points:this.pointsData }),this.mainContainer,RenderPosition.AFTERBEGIN);
  }
}
