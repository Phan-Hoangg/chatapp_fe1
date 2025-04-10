import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import { sendMessage } from "../../../features/chatSlice";
import { SendIcon } from "../../../svg";
import { Attachments } from "./attachments";
import EmojiPickerApp from "./EmojiPicker";
import Input from "./Input";
import SocketContext from "../../../context/SocketContext";

// Component ChatActions xử lý giao diện và logic gửi tin nhắn trong chat.
function ChatActions({ socket }) {
  // Khởi tạo dispatch để gửi action lên Redux store
  const dispatch = useDispatch();

  // State quản lý hiển thị của emoji picker, menu đính kèm, trạng thái loading, và nội dung tin nhắn hiện tại
  const [showPicker, setShowPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Lấy thông tin conversation đang active và trạng thái của chat từ Redux store
  const { activeConversation, status } = useSelector((state) => state.chat);
  // Lấy thông tin người dùng từ Redux store
  const { user } = useSelector((state) => state.user);
  // Lấy token của người dùng, dùng cho việc xác thực khi gửi tin nhắn
  const { token } = user;

  // Sử dụng useRef để tham chiếu đến input text (trong component Input)
  const textRef = useRef();

  // Đối tượng values chứa các thông tin cần thiết để gửi tin nhắn
  const values = {
    message, // Nội dung tin nhắn
    convo_id: activeConversation._id, // ID của cuộc hội thoại đang active
    files: [], // Danh sách file đính kèm (hiện tại chưa có file đính kèm)
    token, // Token người dùng, dùng để xác thực phía server
  };

  // Hàm xử lý khi gửi tin nhắn (submit form)
  const SendMessageHandler = async (e) => {
    // Ngăn chặn hành vi mặc định của form submit (không reload trang)
    e.preventDefault();
    // Bật trạng thái loading để hiển thị loader trên nút gửi
    setLoading(true);

    // Dispatch action sendMessage với dữ liệu tin nhắn (values)
    let newMsg = await dispatch(sendMessage(values));

    // Phát sự kiện "send message" qua socket, truyền payload của tin nhắn mới
    socket.emit("send message", newMsg.payload);
    // Reset nội dung tin nhắn sau khi gửi
    setMessage("");
    // Tắt trạng thái loading
    setLoading(false);
  };

  return (
    // Form chứa các thành phần giao diện gửi tin nhắn
    <form
      onSubmit={(e) => SendMessageHandler(e)}
      className="dark:bg-dark_bg_2 h-[60px] w-full flex items-center absolute bottom-0 py-2 px-4 select-none"
    >
      {/* Container chứa emoji, đính kèm, input và nút gửi */}
      <div className="w-full flex items-center gap-x-2">
        {/* Phần chứa các tùy chọn emoji và đính kèm */}
        <ul className="flex gap-x-2">
          {/* Component EmojiPickerApp hiển thị picker emoji */}
          <EmojiPickerApp
            textRef={textRef} // Truyền ref của input để chèn emoji vào vị trí hiện tại
            message={message} // Nội dung tin nhắn hiện tại
            setMessage={setMessage} // Hàm cập nhật nội dung tin nhắn
            showPicker={showPicker} // State hiển thị emoji picker
            setShowPicker={setShowPicker} // Hàm cập nhật state hiển thị emoji picker
            setShowAttachments={setShowAttachments} // Đảm bảo khi chọn emoji thì menu đính kèm ẩn đi
          />
          {/* Component Attachments hiển thị các tùy chọn đính kèm (file, ảnh, v.v.) */}
          <Attachments
            showAttachments={showAttachments} // State hiển thị menu đính kèm
            setShowAttachments={setShowAttachments} // Hàm cập nhật state hiển thị menu đính kèm
            setShowPicker={setShowPicker} // Ẩn emoji picker khi mở menu đính kèm
          />
        </ul>
        {/* Component Input hiển thị ô nhập tin nhắn */}
        <Input message={message} setMessage={setMessage} textRef={textRef} />
        {/* Nút gửi tin nhắn */}
        <button type="submit" className="btn">
          {status === "loading" && loading ? (
            // Nếu trạng thái đang loading, hiển thị loader (ClipLoader)
            <ClipLoader color="#E9EDEF" size={25} />
          ) : (
            // Nếu không, hiển thị biểu tượng gửi tin (SendIcon)
            <SendIcon className="dark:fill-dark_svg_1" />
          )}
        </button>
      </div>
    </form>
  );
}

// Component bọc ChatActions với SocketContext để lấy socket từ context
const ChatActionsWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <ChatActions {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ChatActionsWithSocket;
