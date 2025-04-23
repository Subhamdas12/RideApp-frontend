import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { cancelRide, getMyProfile, getMyRides, requestRide } from "./riderAPI";

const initialState = {
  rider: null,
  status: "idle",
  error: null,
  rides: null,
  rideRequest: null,
  currentRide: null,
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

export const getMyRidesAsync = createAsyncThunk(
  "rider/getMyRides",
  async (pagination, { rejectWithValue }) => {
    try {
      const response = await getMyRides(pagination);

      if (response.error) {
        return rejectWithValue(response.error);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch rides");
    }
  }
);

export const requestRideAsync = createAsyncThunk(
  "rider/requestRide",
  async (rideRequest, { rejectWithValue }) => {
    try {
      const response = await requestRide(rideRequest);

      if (response.error) {
        return rejectWithValue(response.error);
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to request ride");
    }
  }
);

export const cancelRideAsync = createAsyncThunk(
  "driver/cancelRide",
  async (rideId, { rejectWithValue }) => {
    try {
      const response = await cancelRide(rideId);

      if (response.error) {
        return rejectWithValue(response.error);
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to cancel ride");
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
    resetRiderRides: (state) => {
      state.rides = null;
    },
    setCurrentRide: (state, action) => {
      state.currentRide = JSON.parse(action.payload);
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
      })
      .addCase(getMyRidesAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getMyRidesAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rides = action.payload;
      })
      .addCase(getMyRidesAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(requestRideAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(requestRideAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rideRequest = action.payload;
      })
      .addCase(requestRideAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(cancelRideAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(cancelRideAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentRide = action.payload.data;
      })
      .addCase(cancelRideAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  increment,
  decrement,
  incrementByAmount,
  resetRiderRides,
  setCurrentRide,
} = riderSlice.actions;

export const selectRider = (state) => state.rider.rider;
export const selectRides = (state) => state.rider.rides;
export const selectRequestRide = (state) => state.rider.rideRequest;
export const selectCurrentRide = (state) => state.rider.currentRide;

export const incrementIfOdd = (amount) => (dispatch, getState) => {
  const currentValue = selectCount(getState());
  if (currentValue % 2 === 1) {
    dispatch(incrementByAmount(amount));
  }
};

export default riderSlice.reducer;
