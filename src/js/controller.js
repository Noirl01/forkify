// MVC
import { MODAL_CLOSE_SEC } from './config.js';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeViewn from './views/addRecipeView.js';
// Polyfilling
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import addRecipeView from './views/addRecipeView.js';

if (module.hot) {
  module.hot.accept();
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView._renderSpinner();
    // Result view to highlight choosen search result
    resultsView.update(model.getSearchResultsPage());
    //Updating bookmark view
    bookmarksView.update(model.state.bookmarks);
    // Loading Recipe
    await model.loadRecipe(id);
    // Rendering Recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  try {
    // Start spinner
    resultsView._renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;

    // Load search results
    await model.loadSearchResults(query);
    // Render search results
    resultsView.render(model.getSearchResultsPage());
    // Pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPagination = function (goToPage) {
  // Render search results
  resultsView.render(model.getSearchResultsPage(goToPage));
  // Pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  // Update the View of recipe.
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // Add/Remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // Update Recipe view
  recipeView.update(model.state.recipe);
  // Render Bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView._renderSpinner();
    // Upload Recipe
    await model.uploadRecipe(newRecipe);

    // Render new recipe
    recipeView.render(model.state.recipe);
    // Display success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);
    // Change URL #ID
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('**', err);
    addRecipeView.renderError(err);
  }
};
const init = function () {
  bookmarksView.addHanderRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUplolad(controlAddRecipe);
};

init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
