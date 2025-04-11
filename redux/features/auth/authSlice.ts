import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { login, logout, refreshToken, signup } from "./authAPI";
const initialState = {
  value: 0,
  status: "idle",
  user: null,
  error: null,
};

export const signupAsync = createAsyncThunk(
  "user/signup",
  async (userDetails, { rejectWithValue }) => {
    try {
      const response = await signup(userDetails);

      if (response.error) {
        return rejectWithValue(response.error);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error || "Failed to sign up user");
    }
  }
);

export const loginAsync = createAsyncThunk(
  "user/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await login(credentials);

      if (response.error) {
        return rejectWithValue(response.error);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error || "Failed to login user");
    }
  }
);
export const refreshTokenAsync = createAsyncThunk(
  "user/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await refreshToken();

      if (response.error) {
        return rejectWithValue(response.error);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error || "Failed to login user");
    }
  }
);

export const logoutAsync = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await logout();

      if (response.error) {
        return rejectWithValue(response.error);
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error || "Failed to logout user");
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
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
      .addCase(signupAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(signupAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(signupAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(loginAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(refreshTokenAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(refreshTokenAsync.rejected, (state, action) => {
        state.status = "failed";
        state.user = null;
        state.error = action.payload;
      })
      .addCase(logoutAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logoutAsync.fulfilled, (state) => {
        state.status = "succeeded";
        state.user = null;
      })
      .addCase(logoutAsync.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { increment, decrement, incrementByAmount } = authSlice.actions;

export const selectStatus = (state) => state.auth.status;
export const selectUser = (state) => state.auth.user;

export const incrementIfOdd = (amount) => (dispatch, getState) => {
  const currentValue = selectCount(getState());
  if (currentValue % 2 === 1) {
    dispatch(incrementByAmount(amount));
  }
};

export default authSlice.reducer;
