import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Định nghĩa endpoint cho các request liên quan đến xác thực (auth)
const AUTH_ENDPOINT = `${process.env.REACT_APP_API_ENDPOINT}/auth`;

// State ban đầu của slice người dùng, chứa thông tin trạng thái, lỗi và thông tin user
const initialState = {
  status: "", // Trạng thái của các thao tác (loading, succeeded, failed)
  error: "",  // Thông báo lỗi nếu có lỗi xảy ra
  user: {
    id: "",
    name: "",
    email: "",
    picture: "",
    status: "",
    token: "",
  },
};

// Async thunk đăng ký người dùng: gửi request POST đến /auth/register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (values, { rejectWithValue }) => {
    try {
      // Gửi request đăng ký với các giá trị từ form đăng ký
      const { data } = await axios.post(`${AUTH_ENDPOINT}/register`, {
        ...values,
      });
      // Nếu thành công, trả về dữ liệu từ API
      return data;
    } catch (error) {
      // Nếu có lỗi, trả về thông báo lỗi thông qua rejectWithValue
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

// Async thunk đăng nhập người dùng: gửi request POST đến /auth/login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (values, { rejectWithValue }) => {
    try {
      // Gửi request đăng nhập với các giá trị từ form đăng nhập
      const { data } = await axios.post(`${AUTH_ENDPOINT}/login`, {
        ...values,
      });
      // Nếu thành công, trả về dữ liệu từ API
      return data;
    } catch (error) {
      // Nếu có lỗi, trả về thông báo lỗi thông qua rejectWithValue
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

// Tạo slice user với các reducer đồng bộ và xử lý các async thunk qua extraReducers
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Reducer logout: Xóa thông tin người dùng và đặt lại trạng thái ban đầu
    logout: (state) => {
      state.status = "";
      state.error = "";
      state.user = {
        id: "",
        name: "",
        email: "",
        picture: "",
        status: "",
        token: "",
      };
    },
    // Reducer changeStatus: Cho phép cập nhật trạng thái (status) của user (ví dụ: chuyển sang loading, succeeded, failed)
    changeStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      // Xử lý cho registerUser async thunk
      .addCase(registerUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = "";
        // Cập nhật thông tin người dùng từ payload của API (chứa trường user)
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Xử lý cho loginUser async thunk
      .addCase(loginUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = "";
        // Cập nhật thông tin người dùng từ payload của API (chứa trường user)
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Xuất các action đồng bộ (logout, changeStatus) để sử dụng trong các component
export const { logout, changeStatus } = userSlice.actions;

// Xuất reducer của userSlice để cấu hình vào store của Redux
export default userSlice.reducer;
