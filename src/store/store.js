import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import { userApi } from '../api/UserApi';
import { postApi } from '../api/PostApi';
import { commentApi } from '../api/CommentApi';
import { postsApi } from '../socketApi/SocketPostsApi';
import { commentsApi } from '../socketApi/SocketCommentsApi';
import authReducer from '../slice/authSlice';
import sortReducer from '../slice/sortSlice'; 

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['sort', 'auth'], 
};

const rootReducer = combineReducers({
  [userApi.reducerPath]: userApi.reducer,
  [postApi.reducerPath]: postApi.reducer,
  [commentApi.reducerPath]: commentApi.reducer,
  [postsApi.reducerPath]: postsApi.reducer,
  [commentsApi.reducerPath]: commentsApi.reducer,
  auth: authReducer,
  sort: sortReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    const apis = [userApi, postApi, commentApi, postsApi, commentsApi];
    return apis.reduce(
      (middleware, api) => middleware.concat(api.middleware),
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      })
    );
  },
});

export const persistor = persistStore(store);

setupListeners(store.dispatch);
