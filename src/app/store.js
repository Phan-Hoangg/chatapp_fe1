// Import các hàm cần thiết từ Redux Toolkit và Redux Persist
import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import createFilter from "redux-persist-transform-filter";
import storage from "redux-persist/lib/storage"; // Sử dụng localStorage làm nơi lưu trữ

// Import các slice (reducer) được định nghĩa trong ứng dụng
import userSlice from "../features/userSlice";
import chatSlice from "../features/chatSlice";

// Tạo một transform filter chỉ lưu trữ phần "user" của state từ userSlice
const saveUserOnlyFilter = createFilter("user", ["user"]);

// Cấu hình persist cho Redux:
// - key: tên key lưu trữ trong localStorage
// - storage: sử dụng localStorage làm nơi lưu trữ state
// - whitelist: chỉ lưu state có tên "user" (các state khác sẽ không được lưu)
// - transforms: áp dụng transform filter để lọc chỉ lưu phần "user"
const persistConfig = {
  key: "user",
  storage,
  whitelist: ["user"],
  tranforms: [saveUserOnlyFilter],
};

// Kết hợp các reducer thành rootReducer, bao gồm:
// - user: quản lý state người dùng
// - chat: quản lý state liên quan đến chat
const rootReducer = combineReducers({
  user: userSlice,
  chat: chatSlice,
});

// Áp dụng persist cho rootReducer theo cấu hình persistConfig
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Cấu hình store sử dụng Redux Toolkit
export const store = configureStore({
  reducer: persistedReducer, // Sử dụng reducer đã được persist
  middleware: (getDefaultMiddleware) =>
    // Tắt kiểm tra serializable để tránh lỗi với Redux Persist
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: true, // Bật Redux DevTools để dễ dàng debug
});

// Tạo persistor để có thể quản lý việc rehydrate state từ localStorage
export const persistor = persistStore(store);
