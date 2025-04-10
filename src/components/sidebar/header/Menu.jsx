import { useDispatch } from "react-redux";
import { logout } from "../../../features/userSlice";
import { useState } from "react";

// Component Menu hiển thị menu cho người dùng với các tùy chọn:
// - Tạo nhóm (Tạo Nhóm)
// - Đăng xuất (Đăng Xuất)
export default function Menu({ setShowCreateGroup }) {
  // Sử dụng useDispatch của Redux để gửi action (ở đây dùng cho logout)
  const dispatch = useDispatch();

  return (
    <>
      {/* Container menu được định vị tuyệt đối, nằm bên phải */}
      <div className="absolute right-1 z-50 dark:bg-dark_bg_2 dark:text-dark_text_1 shadow-md w-52">
        <ul>
          {/* Mục "Tạo Nhóm": khi click sẽ gọi hàm setShowCreateGroup(true) để hiển thị modal tạo nhóm */}
          <li
            className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3"
            onClick={() => setShowCreateGroup(true)}
          >
            <span>Tạo Nhóm</span>
          </li>
          {/* Mục "Đăng Xuất": khi click sẽ dispatch action logout từ userSlice */}
          <li
            className="py-3 pl-5 cursor-pointer hover:bg-dark_bg_3"
            onClick={() => dispatch(logout())}
          >
            <span>Đăng Xuất</span>
          </li>
        </ul>
      </div>
    </>
  );
}
