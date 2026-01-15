import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, setCredentials } from "../slice/authSlice";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACK_END_API}/api/users`,
    method: "POST",
    credentials: "include",
  }),
  endpoints: (builder) => {
    return {
      createUser: builder.mutation({
        query: (newUser) => ({
          url: "register",
          body: newUser,
        }),
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(
              setCredentials({
                user: data.user,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
              })
            );
          } catch (err) {
            console.error("Register failed", err);
          }
        },
      }),
      loginUser: builder.mutation({
        query: (userCred) => ({
          url: "login",
          body: userCred,
        }),
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(
              setCredentials({
                user: data.user,
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
              })
            );
          } catch (err) {
            console.error("Login failed", err);
          }
        },
      }),
      refreshUser: builder.mutation({
        query: (userCred) => ({
          url: "refresh",
          body: userCred,
        }),
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            dispatch(
              setCredentials({
                user: data.user,
                accessToken: data.accessToken,
              })
            );
          } catch (err) {
            console.error("Login failed", err);
          }
        },
      }),
      logoutUser: builder.mutation({
        query: (userCred) => ({
          url: "logout",
          body: userCred,
        }),
        async onQueryStarted(arg, { dispatch, queryFulfilled }) {
          try {
            dispatch(logout());
          } catch (err) {
            console.error("Logout failed", err);
          }
        },
      }),
    };
  },
});

export const {
  useCreateUserMutation,
  useLoginUserMutation,
  useRefreshUserMutation,
  useLogoutUserMutation,
} = userApi;
