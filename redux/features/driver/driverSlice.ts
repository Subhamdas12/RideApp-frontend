import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  acceptRide,
  cancelRide,
  endRide,
  getMyProfile,
  getMyRides,
  setDriverAvailability,
  startRide,
} from "./driverAPI";

const initialState = {
  driver: null,
  status: "idle",
  error: null,
  rides: null,
  rideRequests: [],
  currentRide: null,
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

export const getMyRidesForDriverAsync = createAsyncThunk(
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

export const setDriverAvailabilityAsync = createAsyncThunk(
  "driver/setDriverAvailability",
  async (isAvailable: boolean, { rejectWithValue }) => {
    try {
      const response = await setDriverAvailability(isAvailable);

      if (response.error) {
        return rejectWithValue(response.error);
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update availability");
    }
  }
);

export const acceptRideAsync = createAsyncThunk(
  "driver/acceptRide",
  async (rideRequestId, { rejectWithValue }) => {
    try {
      const response = await acceptRide(rideRequestId);

      if (response.error) {
        return rejectWithValue(response.error);
      }

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to accept ride");
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

export const startRideAsync = createAsyncThunk(
  "driver/startRide",
  async ({ rideId, rideStartDTO }, { rejectWithValue }) => {
    try {
      const response = await startRide(rideId, rideStartDTO);

      if (response.error) {
        return rejectWithValue(response.error);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to start ride");
    }
  }
);

export const endRideAsync = createAsyncThunk(
  "driver/endRide",
  async (rideId, { rejectWithValue }) => {
    try {
      const response = await endRide(rideId);

      if (response.error) {
        return rejectWithValue(response.error);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to end ride");
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
    resetDriverRides: (state) => {
      state.rides = null;
    },
    addRideRequest: (state, action) => {
      console.log(JSON.parse(action.payload));
      state.rideRequests.push(JSON.parse(action.payload));
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
      })
      .addCase(getMyRidesForDriverAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getMyRidesForDriverAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rides = action.payload;
      })
      .addCase(getMyRidesForDriverAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(setDriverAvailabilityAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(setDriverAvailabilityAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.driver = action.payload;
      })
      .addCase(setDriverAvailabilityAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.driver = null;
      })
      .addCase(acceptRideAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(acceptRideAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentRide = action.payload.data; // ✅ set the current ride
      })
      .addCase(acceptRideAsync.rejected, (state, action) => {
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
      })
      .addCase(startRideAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(startRideAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentRide = action.payload.data; // response is RideDTO
      })
      .addCase(startRideAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(endRideAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(endRideAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentRide = null;
      })
      .addCase(endRideAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const {
  increment,
  decrement,
  incrementByAmount,
  resetDriverRides,
  addRideRequest,
} = driverSlice.actions;

export const selectDriver = (state) => state.driver.driver;
export const selectDriverRides = (state) => state.driver.rides;
export const selectRideRequests = (state) => state.driver.rideRequests;
export const selectDriverCurrentRide = (state) => state.driver.currentRide;
export const incrementIfOdd = (amount) => (dispatch, getState) => {
  const currentValue = selectCount(getState());
  if (currentValue % 2 === 1) {
    dispatch(incrementByAmount(amount));
  }
};

export default driverSlice.reducer;
