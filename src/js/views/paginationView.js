import View from './view'
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _generateMarkup() {
    //console.log("total Pages--", this._data.totalPage);
    const currentPage = this._data.page;
    const totalPage = this._data.totalPage;
    //console.log(totalPage);

    if (currentPage === 1 && totalPage > 1) {
      return `${this._generateMarkupNext(currentPage, totalPage)} 
      ${this._generateTotalPage(currentPage, totalPage)}   
      `;
    }
    // last Page
    if (currentPage === totalPage && totalPage > 1) {
      return `
      ${this._generateTotalPage(currentPage, totalPage)}
      ${this._generateMarkupBack(currentPage)}`;
    }
    // on Middle page
    if (currentPage > 1 && currentPage < totalPage) {


      return `
      <div>
      ${this._generateMarkupNext(currentPage)}
      ${this._generateTotalPage(currentPage, totalPage)}
      ${this._generateMarkupBack(currentPage)}
      </div> 
   
      `
    }
    // only one page data
    return ``;

  }
  addHandlerClick(controllerHandler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const gotoPage = +btn.dataset.goto;

      controllerHandler(gotoPage);
    })
  }

  _generateMarkupNext(currentPage, totalPage) {

    return `
      <button data-goto=" ${currentPage + 1}" class="btn--inline pagination__btn--next">
    
        <svg class="search__icon">
           <use href="${icons}#icon-arrow-right"></use>
        </svg>     
      </button>
      `
  }
  _generateMarkupBack(currentPage, totalPage) {
    return `
    <button   data-goto=" ${currentPage - 1}" class="btn--inline pagination__btn--prev">
       <svg class="search__icon"> 
         <use href="${icons}#icon-arrow-left"></use> 
       </svg>
    
    </button>
      `;
  }

  _generateTotalPage(currentPage, totalPage) {
    return `  
    
    <span class="btn--inline pagination__btn--prev" >Page-${currentPage}/${totalPage}</span>           
       `
  }
}

export default new PaginationView();