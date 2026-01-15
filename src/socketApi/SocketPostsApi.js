import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { socket } from "../config/socketConfig";

export const postsApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Posts"],
  endpoints: (builder) => ({
    getPosts: builder.query({
      queryFn: async (
        { cursor = null, currentUserId, sort = "newest" },
        { getState }
      ) => {
        return new Promise((resolve) => {
          socket.emit(
            "FETCH_POSTS_REQUEST",
            { cursor, currentUserId, limit: 10 },
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
      serializeQueryArgs: ({ queryArgs }) => ({
        currentUserId: queryArgs.currentUserId,
        sort: queryArgs.sort,
      }),
      merge: (currentCacheData, newData) => {
        if (!currentCacheData) {
          return newData;
        }
        return {
          posts: [...currentCacheData.posts, ...newData.posts],
          nextCursor: newData.nextCursor,
          hasMore: newData.hasMore,
        };
      },
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded }) {
        try {
          await cacheDataLoaded;

          const handleNewPost = (response) => {
            updateCachedData((draft) => {
              const currentUserId = arg.currentUserId;
              const newPost = response.data;
              newPost.isAuthor = newPost.author._id === currentUserId;
              draft.posts.unshift(newPost);
            });
          };

          const handlePostUpdate = (response) => {
            if (response.status === "ok") {
              updateCachedData((draft) => {
                const postIndex = draft.posts.findIndex(
                  (post) => post._id === response.data._id
                );
                if (postIndex !== -1) {
                  const currentUserId = arg.currentUserId;
                  draft.posts[postIndex] = {
                    ...response.data,
                    isAuthor: response.data.author._id === currentUserId,
                    userInteraction: response.data.likes?.includes(
                      currentUserId
                    )
                      ? "like"
                      : response.data.dislikes?.includes(currentUserId)
                      ? "dislike"
                      : "none",
                  };
                }
              });
            }
          };

          const handlePostDelete = (response) => {
            if (response.status === "ok") {
              updateCachedData((draft) => {
                draft.posts = draft.posts.filter(
                  (post) => post._id !== response.data.postId
                );
              });
            }
          };

          const handleRefetchPosts = (response) => {
            if (response.status === "ok" && response.data) {
              updateCachedData((draft) => {
                const postIndex = draft.posts.findIndex(
                  (post) => post._id === response.data._id
                );
                if (postIndex !== -1) {
                  const currentUserId = arg.currentUserId;
                  draft.posts[postIndex] = {
                    ...response.data,
                    isAuthor: response.data.author._id === currentUserId,
                    userInteraction: response.data.likes?.includes(
                      currentUserId
                    )
                      ? "liked"
                      : response.data.dislikes?.includes(currentUserId)
                      ? "disliked"
                      : "none",
                  };
                }
              });
            }
          };

          socket.on("NEW_POST_BROADCAST", handleNewPost);
          socket.on("POST_UPDATE_BROADCAST", handlePostUpdate);
          socket.on("REFETCH_POSTS", handleRefetchPosts);
          socket.on("POST_DELETE_BROADCAST", handlePostDelete);

          return () => {
            socket.off("NEW_POST_BROADCAST", handleNewPost);
            socket.off("POST_UPDATE_BROADCAST", handlePostUpdate);
            socket.off("REFETCH_POSTS", handleRefetchPosts);
            socket.off("POST_DELETE_BROADCAST", handlePostDelete);
          };
        } catch(error) {
          console.error("Error in onCacheEntryAdded:", error);
        }
      },
    }),
  }),
});

export const { useGetPostsQuery } = postsApi;
