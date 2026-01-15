import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sortBy: "1", // newest 1,by liked 2, by disliked 3
};

const sortSlice = createSlice({
  name: "sort",
  initialState,
  reducers: {
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
  },
});

export const { setSortBy } = sortSlice.actions;
export default sortSlice.reducer;
