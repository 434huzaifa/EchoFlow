import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { userApi } from '../api/UserApi';
import { postApi } from '../api/PostApi';
import { postsApi } from '../socketApi/SocketPostsApi';
import authReducer from '../slice/authSlice';

export const store = configureStore({
  reducer: {
    [userApi.reducerPath]: userApi.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [postsApi.reducerPath]: postsApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => {
    const apis = [userApi, postApi, postsApi];
    return apis.reduce(
      (middleware, api) => middleware.concat(api.middleware),
      getDefaultMiddleware()
    );
  },
});

setupListeners(store.dispatch);
