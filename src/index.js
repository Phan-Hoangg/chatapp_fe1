import React from "react"; // Import React để sử dụng JSX
import ReactDOM from "react-dom/client"; // Import ReactDOM để render ứng dụng vào DOM
import "./index.css"; // Import file CSS toàn cục của ứng dụng
import App from "./App"; // Import component chính App của ứng dụng
import { Provider } from "react-redux"; // Import Provider để kết nối Redux store với React
import { persistor, store } from "./app/store"; // Import Redux store và persistor từ cấu hình store
import { PersistGate } from "redux-persist/integration/react"; // Import PersistGate để tái tạo (rehydrate) state từ Redux Persist

// Tạo root cho React bằng cách sử dụng createRoot, gắn vào phần tử DOM có id "root"
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render ứng dụng vào root, bao bọc App trong Provider để cấp Redux store cho toàn bộ ứng dụng
// PersistGate được sử dụng để chờ quá trình rehydrate state hoàn tất trước khi render App
root.render(
  <Provider store={store}>
    {/* PersistGate: chờ tải state từ localStorage trước khi render App */}
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
