
import icons from '../../img/icons.svg';
export default class View {
  _data;

  render(data, render = true) {
    //console.log(this._data);

    if (!data || Array.isArray(data) && data.length === 0)
      return this.renderError();

    this._data = data;


    const markup = this._generateMarkup();

    if (!render) return markup;
    this._clear();

    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // at this point we have our updated DOM and updated object value we will copy to Old Object
    // On screen DOM Object
    const currentPageElements = Array.from(this._parentElement.querySelectorAll('*'));

    // Pick single single Object from DOM Object array and update the Old DOM Object Value
    newElements.forEach((newEle, i) => {
      // select OLD DOM object as per new DOM object index value
      const onScreenEle = currentPageElements[i];
      // isEqualNode return True id both nodes are equal
      // Also check selected ele in new node firstChild is Text node
      if (!newEle.isEqualNode(onScreenEle) && newEle.firstChild?.nodeValue.trim() !== '') {
        onScreenEle.textContent = newEle.textContent;
      }
      // Actually we have data properties in our attributes of our button 
      // thats why we need to copy them and updated to our old DOM objects.
      if (!newEle.isEqualNode(onScreenEle)) {

        Array.from(newEle.attributes)?.forEach(newAtr =>
          onScreenEle?.setAttribute(newAtr.name, newAtr.value))
      }
    })

  }
  renderSpinner() {
    const markup = `<div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderError(message = this._errorMessage) {
    // console.log("Error Message", message);
    const markup = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }

  renderSucess(message = this._message) {
    const markup = `<div class="error">
    <div>
      <svg>
        <use href="${icons}#icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div>`;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup)
  }
}
