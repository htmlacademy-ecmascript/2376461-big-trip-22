import {render,RenderPosition} from '../framework/render.js';

import InfoView from '../view/info-view.js';

export default class InfoPresenter {
  #tripMainElement = null;

  constructor() {
  }

  init(data) {
    this.pointsData = data;
    this.#tripMainElement = document.querySelector('.trip-main');

    render(new InfoView({ points:this.pointsData }),this.#tripMainElement,RenderPosition.AFTERBEGIN);
  }
}
