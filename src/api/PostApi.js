import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACK_END_API}/api/posts`,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (newPost) => ({
        method: "POST",
        body: newPost,
      }),
    }),
    updatePost: builder.mutation({
      query: ({ postId, updatedPost }) => ({
        url: `${postId}`,
        method: "PUT",
        body: updatedPost,
      }),
    }),
    deletePost: builder.mutation({
      query: (postId) => ({
        url: `${postId}`,
        method: "DELETE",
      }),
    }),
    likePost: builder.mutation({
      query: (postId) => ({
        url: `${postId}/like`,
        method: "POST",
      }),
    }),
    dislikePost: builder.mutation({
      query: (postId) => ({
        url: `${postId}/dislike`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useDislikePostMutation,
} = postApi;
