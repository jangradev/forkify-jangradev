import View from "./view";

import previewView from './previewView';
import PreviewView from "./previewView";

class ResultView extends PreviewView {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'We could not find that recipe.Please try another one!'
  _successMessage =
    'Start by searching for a recipe or an ingredient. Have fun!';


}

export default new ResultView();
