import { useSelector } from "react-redux"; // Sử dụng hook useSelector để lấy dữ liệu từ Redux store
import { ChatIcon, CommunityIcon, DotsIcon, StoryIcon } from "../../../svg"; // Import các icon từ thư mục svg (một số icon hiện đang không sử dụng)
import { useState } from "react"; // Import hook useState để quản lý state cục bộ của component
import Menu from "./Menu"; // Import component Menu hiển thị các tùy chọn (như Tạo nhóm, Đăng xuất)
import { CreateGroup } from "./createGroup"; // Import component CreateGroup để tạo cuộc trò chuyện nhóm

export default function SidebarHeader() {
  // Lấy thông tin user từ Redux store (state.user)
  const { user } = useSelector((state) => state.user);
  // State để quản lý hiển thị menu (nút có dấu chấm lửng)
  const [showMenu, setShowMenu] = useState(false);
  // State để quản lý hiển thị modal tạo nhóm
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  return (
    <>
      {/* Sidebar header */}
      <div className="h-[50px] dark:bg-dark_bg_2 flex items-center p16">
        {/* Container chứa các phần tử bên trong header, căn giữa và chia đều hai bên */}
        <div className="w-full flex items-center justify-between">
          {/* Phần hiển thị ảnh đại diện của người dùng */}
          <button className="btn">
            <img
              src={user.picture} // Hiển thị ảnh đại diện lấy từ thông tin user
              alt={user.name} // Alt text hiển thị tên người dùng
              className="w-full h-full rounded-full object-cover" // CSS: ảnh tròn, đầy đủ kích thước container và căn chỉnh đối tượng
            />
          </button>
          {/* Phần hiển thị các icon của người dùng */}
          <ul className="flex items-center gap-x-2 5">
            {/* Các icon khác (CommunityIcon, StoryIcon, ChatIcon) hiện được comment, không hiển thị */}
            {/*
            <li>
              <button className="btn">
                <CommunityIcon className="dark:fill-dark_svg_1" />
              </button>
            </li>
            <li>
              <button className="btn">
                <StoryIcon className="dark:fill-dark_svg_1" />
              </button>
            </li>
            <li>
              <button className="btn">
                <ChatIcon className="dark:fill-dark_svg_1" />
              </button>
            </li>
            */}
            {/* Phần icon DotsIcon dùng để mở menu */}
            <li
              className="relative" // relative để định vị menu con bên trong
              onClick={() => setShowMenu((prev) => !prev)} // Đảo ngược trạng thái hiển thị menu khi nhấn vào phần tử
            >
              <button className={`btn ${showMenu ? "bg-dark_hover_1" : ""}`}>
                {/* Hiển thị DotsIcon, với style tương thích chế độ tối */}
                <DotsIcon className="dark:fill-dark_svg_1" />
              </button>
              {/* Nếu state showMenu = true, hiển thị component Menu */}
              {showMenu ? (
                <Menu setShowCreateGroup={setShowCreateGroup} />
              ) : null}
            </li>
          </ul>
        </div>
      </div>
      {/* Hiển thị modal CreateGroup nếu state showCreateGroup = true */}
      {showCreateGroup && (
        <CreateGroup setShowCreateGroup={setShowCreateGroup} />
      )}
    </>
  );
}
