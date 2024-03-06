import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config';
import { AJAX } from './helpers';
import { startsWith } from 'core-js/es/string';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
    totalPage: 1
  },
  bookmarks: [],
  bookmarksId: [],
};

const objectFormat = function (data) {
  let recipe = data.data.recipe;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    cookingTime: recipe.cooking_time,
    serving: recipe.servings,
    ...(recipe.key && { key: recipe.key }),
  };
}
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}`);

    state.recipe = objectFormat(data);


    if (state.bookmarks.some(bookmarked => bookmarked.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (error) {
    console.log('💥Model.js💥', error);
    throw error;
  }
};
export const loadSearchResults = async function (query) {
  try {
    state.search.results = query;
    const data = await AJAX(`${API_URL}/?search=${query}&key=${KEY}`);

    state.search.totalPage = Math.ceil(data.results / state.search.resultsPerPage);

    state.search.results = data.data.recipes.map(ele => {
      return {
        id: ele.id,
        title: ele.title,
        publisher: ele.publisher,
        image: ele.image_url,
        bookmarks: state.bookmarks,
        totalPage: state.search.totalPage,
        ...(ele.key && { key: ele.key }),

      };
    });
    state.search.page = 1;
  } catch (error) {
    console.log('💥Model.js💥', error);
    throw error;
  }
};

export const getSearchResultsPage = function (page = 1) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  const ratio = newServings / state.recipe.serving;
  const newCookingTime = Math.ceil(state.recipe.cookingTime * ratio);
  state.recipe.ingredients.forEach(element => {
    // newQt = oldQt * newServings/oldServing
    element.quantity = element.quantity * ratio;

    element.cookingTime = newCookingTime;
  });
  state.recipe.serving = newServings;
  state.recipe.cookingTime = newCookingTime;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addbookmark = function (stateRecived) {
  state.bookmarks.push(stateRecived);
  if (stateRecived.id === state.recipe.id)
    state.recipe.bookmarked = true;
  persistBookmarks();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(ele => ele.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

export const uploadRecipe = async function (recipeObj) {
  try {
    const ingredients = Object.entries(recipeObj)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].match(/[^,]+/g);
        if (ingArr.length > 3) throw new Error('Wrong ingredients format ! Please correct ');
        const [quantity, unit, description] = ingArr;
        return {
          quantity: quantity ? quantity : null,
          unit,
          description
        };
      });
    const recipe = {
      title: recipeObj.title,
      source_url: recipeObj.sourceUrl,
      image_url: recipeObj.image,
      publisher: recipeObj.publisher,
      cooking_time: +recipeObj.cookingTime,
      servings: +recipeObj.servings,
      ingredients,
    };

    // console.log("upload Object", recipe)
    const dataBack = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    state.recipe = objectFormat(dataBack);
    //console.log("Received Object", state.recipe);
    addbookmark(state.recipe);
  } catch (error) {
    throw error;
  }
};

const init = function () {
  const storedItems = localStorage.getItem('bookmarks');
  if (storedItems) state.bookmarks = JSON.parse(storedItems);
  // console.log(state.bookmarks);
};
init();
