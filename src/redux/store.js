import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import createMiddleware from './middleware/clientMiddleware';
import thunk from 'redux-thunk'
import { createBrowserHistory } from 'history'
import rootReducer from './modules/reducer'
import config from '../config';

import ApiClient from '../helpers/ApiClient';
// import {browserHistory} from 'react-router';
// import { syncHistoryWithStore } from 'react-router-redux';
// import useScroll from 'scroll-behavior/lib/useStandardScroll';
export const history = createBrowserHistory({
  basename: config.basename,
})
const client = new ApiClient();
// const _browserHistory = useScroll(() => browserHistory)();
// export const history = syncHistoryWithStore(_browserHistory, store);

const initialState = {}
const enhancers = []
const middleware = [
  thunk,
  routerMiddleware(history),
  createMiddleware(client)
]


if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
)

const store = createStore(
  rootReducer,
  initialState,
  composedEnhancers
)

if (process.env.NODE_ENV === 'development' && module.hot) {
  module.hot.accept('./modules/reducer', () => {
    store.replaceReducer(rootReducer)
  });
}
export default store
