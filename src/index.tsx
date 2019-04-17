import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter as Router} from "react-router-dom";
import { composeWithDevTools } from 'redux-devtools-extension';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';

import rootReducer from '@music/reducers';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { genreInitialState } from '@music/actions/genre';
import { seriesInitialState } from '@music/actions/series';
import { genreModel, seriesModel, mixModel } from '@music/models';
import { prepareMix } from '@music/actions/mix';
import { moveIdToDoc } from './utils';

const store = createStore(rootReducer, composeWithDevTools(
  applyMiddleware(logger),
  applyMiddleware(thunk)
));

Promise.all([seriesModel.all(), genreModel.all(), mixModel.getLastMix()]).then(result => {
  const [series, genres, mix] = result;
  const { dispatch, getState } = store;

  dispatch(seriesInitialState(series.docs.map(moveIdToDoc)));
  dispatch(genreInitialState(genres.docs.map(moveIdToDoc)));

  const lastMix = mix.docs.map(moveIdToDoc)[0] || {};
  prepareMix(lastMix)(dispatch, getState);

  setTimeout(() => {
    ReactDOM.render(
      <Router>
        <Provider store={store}>
          <App />
        </Provider>
      </Router>,
      document.getElementById('root') as HTMLElement
    );
    registerServiceWorker();
  }, 50);
});
