import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import createFilter from "redux-persist-transform-filter";
import storage from "redux-persist/lib/storage";
//slices
import userSlice from "../features/userSlice";

//saveUserOnlyFilter
const saveUserOnlyFilter = createFilter("user", ["user"]);

// cau hinh persist config
const persistConfig = {
  key: "user", // Key lưu trong localStorage
  storage, // Dùng localStorage để lưu state
  whitelist: ["user"], // Chỉ lưu state "user"
  tranforms: [saveUserOnlyFilter], // Lọc chỉ lưu phần "user"
};

const rootReducer = combineReducers({
  user: userSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer, // Dùng reducer đã kết hợp với persist
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Tắt kiểm tra serializable để tránh lỗi với Redux Persist
    }),
  devTools: true, // Bật Redux DevTools để debug
});

export const persistor = persistStore(store);
