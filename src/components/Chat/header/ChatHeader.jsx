import { useSelector } from "react-redux";
import { VideoCallIcon } from "../../../svg"; // Icon cuộc gọi video
import { capitalize } from "../../../utils/string"; // Hàm viết hoa tên
import { useEffect, useRef, useState } from "react";
import SocketContext from "../../../context/SocketContext"; // Context socket
import Peer from "simple-peer"; // Thư viện gọi video

// Import các hàm tiện ích để lấy thông tin từ users trong conversation
import {
  getConversationName,
  getConversationPicture,
} from "../../../utils/chat";

function ChatHeader({ online, callUser, socket }) {
  // Lấy dữ liệu cuộc trò chuyện đang hoạt động từ redux
  const { activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);

  return (
    <div className="h-[59px] dark:bg-dark_bg_2 flex items-center p16 select-none">
      {/* Container chính */}
      <div className="w-full flex items-center justify-between">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-x-4">
          {/* Ảnh đại diện cuộc trò chuyện */}
          <button className="btn">
            <img
              src={
                activeConversation.isGroup
                  ? activeConversation.picture // Nếu là nhóm => lấy ảnh nhóm
                  : getConversationPicture(user, activeConversation.users) // Nếu là người => lấy ảnh người kia
              }
              alt=""
              className="w-full h-full rounded-full object-cover"
            />
          </button>

          {/* Tên cuộc trò chuyện và trạng thái online */}
          <div className="flex flex-col">
            <h1 className="dark:text-white text-md font-bold">
              {activeConversation.isGroup
                ? activeConversation.name // Tên nhóm
                : capitalize(
                    getConversationName(user, activeConversation.users).split(
                      " "
                    )[0]
                  )}{" "}
              {/* Tên người trò chuyện, viết hoa chữ cái đầu */}
            </h1>
            <span className="text-xs dark:text-dark_svg_2">
              {online ? "online" : ""}
            </span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <ul className="flex items-center gap-x-2.5">
          {/* Nút gọi video */}
          <li onClick={() => callUser()}>
            <button className="btn">
              <VideoCallIcon />
            </button>
          </li>
          {/* Có thể thêm nút gọi thoại ở đây sau */}
        </ul>
      </div>
    </div>
  );
}

// Bọc component bằng SocketContext để nhận socket từ context
const ChatHeaderWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <ChatHeader {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ChatHeaderWithSocket;
