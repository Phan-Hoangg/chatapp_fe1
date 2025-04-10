import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// Import các thành phần của react-router-dom để định tuyến cho ứng dụng
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
// Import hàm io từ socket.io-client để thiết lập kết nối socket
import { io } from "socket.io-client";
// Import SocketContext để cung cấp đối tượng socket cho các component con thông qua Context API
import SocketContext from "./context/SocketContext";

// Import các trang (Pages) của ứng dụng
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";

// Thiết lập kết nối socket, lấy URL từ biến môi trường
// Cắt bỏ phần "/api/v1" để lấy đúng domain cho socket connection
const socket = io(process.env.REACT_APP_API_ENDPOINT.split("/api/v1")[0]);

function App() {
  // Sử dụng Redux hook để lấy thông tin người dùng từ state (user)
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  // Lấy token người dùng từ thông tin user (để xác định trạng thái đăng nhập)
  const { token } = user;

  return (
    <div className="dark">
      {/* Cung cấp đối tượng socket cho toàn bộ ứng dụng thông qua SocketContext */}
      <SocketContext.Provider value={socket}>
        {/* Thiết lập định tuyến của ứng dụng */}
        <Router>
          <Routes>
            {/* Route cho trang chủ (Home) */}
            <Route
              exact
              path="/"
              element={
                // Nếu có token (người dùng đã đăng nhập), hiển thị trang Home, truyền socket làm prop
                token ? <Home socket={socket} /> : <Navigate to="/login" />
              }
            />
            {/* Route cho trang đăng nhập (Login) */}
            <Route
              exact
              path="/login"
              element={
                // Nếu không có token (chưa đăng nhập), hiển thị trang Login; nếu có, chuyển hướng về trang chủ
                !token ? <Login /> : <Navigate to="/" />
              }
            />
            {/* Route cho trang đăng ký (Register) */}
            <Route
              exact
              path="/register"
              element={
                // Nếu không có token (chưa đăng nhập), hiển thị trang Register; nếu có, chuyển hướng về trang chủ
                !token ? <Register /> : <Navigate to="/" />
              }
            />
          </Routes>
        </Router>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
