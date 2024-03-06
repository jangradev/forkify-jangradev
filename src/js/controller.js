import * as model from './model';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultsView from './views/resultsView';
import bookMarksview from './views/bookMarksView';
import paginationView from './views/paginationView';
import addRecipeView from './views/addRecipeView';
import view from './views/view';
import { MODEL_CLOSE_SEC } from './config';

const controlRecipes = async function () {
  try {
    // id colledted from URL
    const locationId = window.location;
    const id = locationId.hash.slice(1);

    if (!id) return;
    // call  soinner method from View class
    recipeView.renderSpinner();
    // resultsView.update(model.getSearchResultsPage());
    await model.loadRecipe(id);
    const { recipe } = model.state;
    recipeView.render(model.state.recipe);
    bookMarksview.render(model.state.bookmarks);

    // update the result as per selected recipe
    //renderSpinner(recipeContainer);
    // loading recipe as per id passed

    controlServings();
  } catch (error) {
    console.log('💥Controller.js💥', error);
    recipeView.renderError();
    console.error(error);
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResults(query);
    // console.log("Recipe recived ", model.state.search.results);

    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (error) {
    console.log('💥Controller.js💥', error);
  }
};

const controlPagination = function (gotoPage) {
  //console.log('♥️♥️♥️Page No♥️♥️♥️', gotoPage);
  resultsView.render(model.getSearchResultsPage(gotoPage));
  paginationView.render(model.state.search);
};

const controlServings = function (newServing = model.state.recipe.serving) {
  model.updateServings(newServing);
  //recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addbookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe);

  bookMarksview.render(model.state.bookmarks);
};

const controlUpload = async function (newRecipe) {
  try {
    const recipeUploadObj = Object.fromEntries(newRecipe);
    // spinner before fetch
    addRecipeView.renderSpinner();
    await model.uploadRecipe(recipeUploadObj);
    console.log('💥User Recipe from Server 💥', model.state.recipe);

    //render uploaded recipe
    recipeView.render(model.state.recipe);

    // sucess message
    addRecipeView.renderSucess();

    // update bookmarks list
    bookMarksview.render(model.state.bookmarks);

    // update browser as per uploaded recipe id
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close window
    setTimeout(() => {
      addRecipeView.toggleWindow();
      //location.reload()
      // that render our addRecipe window again just before window closing 
      setTimeout(() => { addRecipeView._renderForm(); }, MODEL_CLOSE_SEC * 1000)
    }, MODEL_CLOSE_SEC * 1100);
  } catch (error) {
    addRecipeView.renderError(error.message);
    setTimeout(() => { addRecipeView.toggleWindow() }, MODEL_CLOSE_SEC * 1000);
    setTimeout(() => { addRecipeView._renderForm() }, MODEL_CLOSE_SEC * 1100);
  }
};

const controlBookmarkLocal = function () {
  bookMarksview.render(model.state.bookmarks);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  bookMarksview.addHandlerRender(controlBookmarkLocal);
  recipeView.addHandlerAddBookmark(controlBookmark);
  recipeView.addHandlerClick(controlServings);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlUpload);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};

//clearBookmarks();
