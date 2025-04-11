import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMyProfile } from "./driverAPI";

const initialState = {
  driver: null,
  status: "idle",
  error: null,
};

export const getMyProfileAsync = createAsyncThunk(
  "driver/getMyProfile",
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
export const driverSlice = createSlice({
  name: "driver",
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
        state.driver = action.payload;
      })
      .addCase(getMyProfileAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.driver = null;
      });
  },
});

export const { increment, decrement, incrementByAmount } = driverSlice.actions;

export const selectDriver = (state) => state.driver.driver;

export const incrementIfOdd = (amount) => (dispatch, getState) => {
  const currentValue = selectCount(getState());
  if (currentValue % 2 === 1) {
    dispatch(incrementByAmount(amount));
  }
};

export default driverSlice.reducer;
