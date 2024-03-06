import View from "./view";

import previewView from './previewView';
import PreviewView from "./previewView";

class BookmarksView extends PreviewView {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet.find a nice recipe and bookmark it';
  _message = 'Start by searching for a recipe or ingredient. Have a fun!';

  // we want to render bookmarks 1st when our page load
  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }
}
export default new BookmarksView();
