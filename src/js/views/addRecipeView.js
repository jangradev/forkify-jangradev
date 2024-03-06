import View from './view'


class addRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _overlay = document.querySelector('.overlay');
  _windowRecipe = document.querySelector('.add-recipe-window');
  _closeBtn = document.querySelector('.btn--close-modal');
  _openBtn = document.querySelector('.nav__btn--add-recipe');
  _message = 'Recipe was sucessfully uploaded';

  constructor() {
    super();
    this._addHandlerCloseClick();
    this._addHandlerOpenClick();
  }

  toggleWindow() {
    this._windowRecipe.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }
  _addHandlerOpenClick(controllerHandler) {
    this._renderForm();
    this._openBtn.addEventListener('click', this.toggleWindow.bind(this));

  }
  _addHandlerCloseClick(controllerHandler) {
    this._closeBtn.addEventListener('click', () => this.toggleWindow());
    this._overlay.addEventListener('click', () => this.toggleWindow());
  }
  addHandlerUpload(controllerHandler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const data = [...new FormData(this)];
      controllerHandler(data);
    })
  }
  _renderForm() {
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  _generateMarkup() {
    return ` <div class="upload__column">
    <h3 class="upload__heading">Recipe data</h3>
    <label>Title</label>
    <input value="TEST2333" required name="title" type="text" />
    <label>URL</label>
    <input value="TEST2333" required name="sourceUrl" type="text" />
    <label>Image URL</label>
    <input value="TEST2333" required name="image" type="text" />
    <label>Publisher</label>
    <input value="TEST2333" required name="publisher" type="text" />
    <label>Prep time</label>
    <input value="23" required name="cookingTime" type="number" />
    <label>Servings</label>
    <input value="23" required name="servings" type="number" />
  </div>

  <div class="upload__column">
    <h3 class="upload__heading">Ingredients</h3>
    <label>Ingredient 1</label>
    <input
      value="0.5,kg,Rice"
      type="text"
      required
      name="ingredient-1"
      placeholder="Format: 'Quantity,Unit,Description'"
    />
    <label>Ingredient 2</label>
    <input
      value="1,Nos,Avocado"
      type="text"
      name="ingredient-2"
      placeholder="Format: 'Quantity,Unit,Description'"
    />
    <label>Ingredient 3</label>
    <input
      value="4,spoon,salt"
      type="text"
      name="ingredient-3"
      placeholder="Format: 'Quantity,Unit,Description'"
    />
    <label>Ingredient 4</label>
    <input
      type="text"
      name="ingredient-4"
      placeholder="Format: 'Quantity,Unit,Description'"
    />
    <label>Ingredient 5</label>
    <input
      type="text"
      name="ingredient-5"
      placeholder="Format: 'Quantity,Unit,Description'"
    />
    <label>Ingredient 6</label>
    <input
      type="text"
      name="ingredient-6"
      placeholder="Format: 'Quantity,Unit,Description'"
    />
  </div>

  <button class="btn upload__btn">
    <svg>
      <use href="src/img/icons.svg#icon-upload-cloud"></use>
    </svg>
    <span>Upload</span>
  </button>`
  }
}

export default new addRecipeView();