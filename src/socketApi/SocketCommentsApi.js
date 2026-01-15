import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { socket } from "../config/socketConfig";

// RTK Query API for managing posts with WebSocket-based queries
export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Comments"],
  endpoints: (builder) => ({
    // WebSocket-based query for fetching comments
    getComments: builder.query({
      queryFn: async ({ postId }, { getState }) => {
        return new Promise((resolve) => {
          socket.emit(
            "FETCH_COMMENTS_REQUEST",
            { postId, sortBy: "newest" },
            (response) => {
              if (response.status === "error") {
                resolve({ error: response.message });
              } else {
                resolve({ data: response.data });
              }
            }
          );
        });
      },

      // Real-time cache updates via WebSocket broadcasts
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded }) {
        try {
          await cacheDataLoaded;

          // Handle new comment broadcast
          const handleNewComment = (response) => {
            if (response.data.post === arg.postId) {
              updateCachedData((draft) => {
                draft.unshift(response.data);
              });
            }
          };

          // Handle comment update broadcast
          const handleCommentUpdate = (response) => {
            updateCachedData((draft) => {
              const commentIndex = draft.findIndex(
                (comment) => comment._id === response.data._id
              );
              if (commentIndex !== -1) {
                draft[commentIndex] = response.data;
              }
            });
          };

          // Handle comment delete broadcast
          const handleCommentDelete = (response) => {
            updateCachedData((draft) => {
              return draft.filter(
                (comment) => comment._id !== response.data.commentId
              );
            });
          };

          // Handle comment like/dislike broadcast
          const handleCommentLikeDislike = (response) => {
            updateCachedData((draft) => {
              const commentIndex = draft.findIndex(
                (comment) => comment._id === response.data._id
              );
              if (commentIndex !== -1) {
                draft[commentIndex] = response.data;
              }
            });
          };

          // Subscribe to WebSocket events
          socket.on("NEW_COMMENT_BROADCAST", handleNewComment);
          socket.on("COMMENT_UPDATE_BROADCAST", handleCommentUpdate);
          socket.on("COMMENT_DELETE_BROADCAST", handleCommentDelete);
          socket.on("COMMENT_LIKE_BROADCAST", handleCommentLikeDislike);
          socket.on("COMMENT_DISLIKE_BROADCAST", handleCommentLikeDislike);

          // Cleanup function to unsubscribe from events
          return () => {
            socket.off("NEW_COMMENT_BROADCAST", handleNewComment);
            socket.off("COMMENT_UPDATE_BROADCAST", handleCommentUpdate);
            socket.off("COMMENT_DELETE_BROADCAST", handleCommentDelete);
            socket.off("COMMENT_LIKE_BROADCAST", handleCommentLikeDislike);
            socket.off("COMMENT_DISLIKE_BROADCAST", handleCommentLikeDislike);
          };
        } catch (error) {
          console.error("Error in WebSocket subscription:", error);
        }
      },
    }),
  }),
});

export const { useGetCommentsQuery } = commentsApi;
