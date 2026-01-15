import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const commentApi = createApi({
  reducerPath: "commentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACK_END_API}/api/comments`,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Comments"],
  endpoints: (builder) => ({
    createComment: builder.mutation({
      query: (newComment) => ({
        url: `/`,
        method: "POST",
        body: newComment,
      }),
    }),
    updateComment: builder.mutation({
      query: ({ commentId, text }) => ({
        url: `/${commentId}`,
        method: "PUT",
        body: { text },
      }),
    }),
    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `/${commentId}`,
        method: "DELETE",
      }),
    }),
    likeComment: builder.mutation({
      query: (commentId) => ({
        url: `/${commentId}/like`,
        method: "POST",
      }),
    }),
    dislikeComment: builder.mutation({
      query: (commentId) => ({
        url: `/${commentId}/dislike`,
        method: "POST",
      }),
    }),
    createReply: builder.mutation({
      query: ({ commentId, text }) => ({
        url: `/${commentId}/replies`,
        method: "POST",
        body: { text },
      }),
    }),
    updateReply: builder.mutation({
      query: ({ replyId, text }) => ({
        url: `/replies/${replyId}`,
        method: "PUT",
        body: { text },
      }),
    }),
    deleteReply: builder.mutation({
      query: (replyId) => ({
        url: `/replies/${replyId}`,
        method: "DELETE",
      }),
    }),
    likeReply: builder.mutation({
      query: (replyId) => ({
        url: `/replies/${replyId}/like`,
        method: "POST",
      }),
    }),
    dislikeReply: builder.mutation({
      query: (replyId) => ({
        url: `/replies/${replyId}/dislike`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
  useDislikeCommentMutation,
  useCreateReplyMutation,
  useUpdateReplyMutation,
  useDeleteReplyMutation,
  useLikeReplyMutation,
  useDislikeReplyMutation,
} = commentApi;
