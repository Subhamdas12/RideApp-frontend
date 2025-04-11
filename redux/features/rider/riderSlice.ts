import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMyProfile } from "./riderAPI";

const initialState = {
  rider: null,
  status: "idle",
  error: null,
};

export const getMyProfileAsync = createAsyncThunk(
  "rider/getMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMyProfile();

      if (response.error) {
        return rejectWithValue(response.error);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error || "Failed to fetch profile");
    }
  }
);
export const riderSlice = createSlice({
  name: "rider",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getMyProfileAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getMyProfileAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rider = action.payload;
      })
      .addCase(getMyProfileAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.rider = null;
      });
  },
});

export const { increment, decrement, incrementByAmount } = riderSlice.actions;

export const selectRider = (state) => state.rider.rider;

export const incrementIfOdd = (amount) => (dispatch, getState) => {
  const currentValue = selectCount(getState());
  if (currentValue % 2 === 1) {
    dispatch(incrementByAmount(amount));
  }
};

export default riderSlice.reducer;
