import View from './View.js';
import icons from 'url:../../img/icons.svg';
import { state } from '../model.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }
  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      +this._data.results.length / +this._data.resultsPerPage
    );
    // Page 1
    if (currentPage === 1 && numPages > 1)
      return this._generateMarkupButton('next');

    // Last page
    if (currentPage === numPages && numPages > 1)
      return this._generateMarkupButton('prev');
    //Other page
    if (currentPage < numPages) {
      return `
      ${this._generateMarkupButton('prev')}
     ${this._generateMarkupButton('next')}`;
    }
    // Page 1 No other pages
    return ``;
  }

  _generateMarkupButton(direction) {
    const currentPage = this._data.page;
    let page;
    direction == 'prev' ? (page = currentPage - 1) : (page = currentPage + 1);
    return `</button>
    <button data-goto ="${page}" class="btn--inline pagination__btn--${direction}">
      <span>Page ${page}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
  }
}

export default new PaginationView();
