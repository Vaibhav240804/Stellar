import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { login, fetchUserData, signup } from "../utils/api";

const initialState = {
  name: "",
  email: "",
  id: "",
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
  otp: null,
};

export const signin = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      const res = await login(userData);
      return res;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.toString() ||
        error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

export const shareToken = createAsyncThunk(
  "auth/shareToken",
  async (_, thunkAPI) => {
    try {
      const res = await fetchUserData();
      return res;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.toString() ||
        error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

export const logup = createAsyncThunk(
  "auth/logup",
  async (userData, thunkAPI) => {
    try {
      const res = await signup(userData);
      return res;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.toString() ||
        error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const res = await logout();
    return res;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.toString() ||
      error.message;
    return thunkAPI.rejectWithValue({ message });
  }
});

export const otpVal = createAsyncThunk(
  "auth/verifyOtp",
  async (otpData, thunkAPI) => {
    try {
      const response = await verifyOtp(otpData);
      return response;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.toString() ||
        error.message;
      return thunkAPI.rejectWithValue({ message });
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(signin.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(signin.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.name = payload.name;
      state.email = payload.email;
      state.id = payload.id;
    });
    builder.addCase(signin.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.message = payload.message;
    });
    builder.addCase(shareToken.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(shareToken.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.otp = payload.otp;
    });
    builder.addCase(shareToken.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.message = payload.message;
    });
    builder.addCase(logup.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logup.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.name = payload.name;
      state.email = payload.email;
      state.id = payload.id;
    });
    builder.addCase(logup.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.message = payload.message;
    });
    builder.addCase(logout.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.name = "";
      state.email = "";
      state.id = "";
    });
    builder.addCase(logout.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.message = payload.message;
    });
    builder.addCase(otpVal.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(otpVal.fulfilled, (state) => {
      state.isLoading = false;
      state.isSuccess = true;
    });
    builder.addCase(otpVal.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.message = payload
        ? payload.message
        : "Failed to verify OTP. Please try again.";
    });
  },
});

export const { reset } = authSlice.actions;

export default authSlice.reducer;
