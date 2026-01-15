import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { socket } from "../config/socketConfig";

// RTK Query API for managing posts with WebSocket-based queries
export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Posts"],
  endpoints: (builder) => ({
    // WebSocket-based query for fetching posts with infinite scroll support
    getPosts: builder.query({
      queryFn: async (
        { cursor = null, currentUserId, sortBy = "1" },
        { getState }
      ) => {
        return new Promise((resolve) => {
          socket.emit(
            "FETCH_POSTS_REQUEST",
            { cursor, currentUserId, limit: 10, sort: sortBy },
            (response) => {
              if (response.status === "error") {
                resolve({ error: response.message });
              } else {
                resolve({
                  data: {
                    posts: response.data,
                    nextCursor: response.nextCursor,
                    hasMore: response.hasMore,
                  },
                });
              }
            }
          );
        });
      },
      
      // Serialize query args to ensure proper caching per user and sort
      serializeQueryArgs: ({ queryArgs }) => ({
        currentUserId: queryArgs.currentUserId,
        sortBy: queryArgs.sortBy,
      }),
      
      // Merge strategy for infinite scroll pagination
      merge: (currentCacheData, newData, { arg }) => {
        // If no cursor, it's a fresh fetch (new tab/sort), replace data
        if (!arg.cursor) {
          return newData;
        }
        // If cursor exists, it's pagination, append data
        if (!currentCacheData) {
          return newData;
        }
        return {
          posts: [...currentCacheData.posts, ...newData.posts],
          nextCursor: newData.nextCursor,
          hasMore: newData.hasMore,
        };
      },
      
      // Real-time cache updates via WebSocket broadcasts
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded }) {
        try {
          await cacheDataLoaded;

          // Handle new post broadcast
          const handleNewPost = (response) => {
            updateCachedData((draft) => {
              const newPost = response.data;
              newPost.isAuthor = newPost.author._id === arg.currentUserId;
              draft.posts.unshift(newPost);
            });
          };

          // Handle post update broadcast 
          const handlePostUpdate = (response) => {
            if (response.status === "ok") {
              updateCachedData((draft) => {
                const postIndex = draft.posts.findIndex(
                  (post) => post._id === response.data._id
                );
                if (postIndex !== -1) {
                  draft.posts[postIndex] = {
                    ...response.data,
                    isAuthor: response.data.author._id === arg.currentUserId,
                    userInteraction: response.data.likes?.includes(arg.currentUserId)
                      ? "like"
                      : response.data.dislikes?.includes(arg.currentUserId)
                      ? "dislike"
                      : "none",
                  };
                }
              });
            }
          };

          // Handle post delete broadcast
          const handlePostDelete = (response) => {
            if (response.status === "ok") {
              updateCachedData((draft) => {
                draft.posts = draft.posts.filter(
                  (post) => post._id !== response.data.postId
                );
              });
            }
          };

          // Handle refetch request to update post counts
          const handleRefetchPosts = (response) => {
            if (response.status === "ok" && response.data) {
              updateCachedData((draft) => {
                const postIndex = draft.posts.findIndex(
                  (post) => post._id === response.data._id
                );
                if (postIndex !== -1) {
                  draft.posts[postIndex] = {
                    ...response.data,
                    isAuthor: response.data.author._id === arg.currentUserId,
                    userInteraction: response.data.likes?.includes(arg.currentUserId)
                      ? "liked"
                      : response.data.dislikes?.includes(arg.currentUserId)
                      ? "disliked"
                      : "none",
                  };
                }
              });
            }
          };

          // Subscribe to WebSocket events
          socket.on("NEW_POST_BROADCAST", handleNewPost);
          socket.on("POST_UPDATE_BROADCAST", handlePostUpdate);
          socket.on("REFETCH_POSTS", handleRefetchPosts);
          socket.on("POST_DELETE_BROADCAST", handlePostDelete);

          // Cleanup function to unsubscribe from events
          return () => {
            socket.off("NEW_POST_BROADCAST", handleNewPost);
            socket.off("POST_UPDATE_BROADCAST", handlePostUpdate);
            socket.off("REFETCH_POSTS", handleRefetchPosts);
            socket.off("POST_DELETE_BROADCAST", handlePostDelete);
          };
        } catch (error) {
          console.error("Error in onCacheEntryAdded:", error);
        }
      },
    }),
  }),
});

export const { useGetPostsQuery } = postsApi;