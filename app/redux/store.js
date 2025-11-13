/**
 * Redux Store
 * create redux store with middleware,
 * enhancers & root reducer
 * configure redux persist
 * @flow
 * @format
 */

import {configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import {AsyncStorage} from '@app/utils';
import {ENV} from '@app/config';
import {rootReducer} from './rootReducer';
import {rootSagas} from './rootSagas';

/*-----[ persist configurations ]------*/
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['commonReducer'],
};

/*-----------[ create store ]------------*/
function createStore() {
  const sagaMiddleware = createSagaMiddleware();

  // New middleware can be added here
  const middleware = [sagaMiddleware];

  const persistedReducer = persistReducer(persistConfig, rootReducer);

  const store = configureStore({
    reducer: persistedReducer,
    devTools: ENV === 'development',
    middleware,
  });

  const persistor = persistStore(store);

  // run sagas
  rootSagas.forEach(sagaMiddleware.run);

  if (module && module.hot) {
    module.hot.accept(() => {
      const newRootReducer = require('./rootReducer').rootReducer;
      store.replaceReducer(newRootReducer);
    });
  }

  return {store, persistor};
}

export const {store, persistor} = createStore();
