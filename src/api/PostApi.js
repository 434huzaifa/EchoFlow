import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACK_END_API}/api/posts`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (newPost) => ({
        url: "create",
        method: "POST",
        body: newPost,
      }),
    }),
  }),
});
