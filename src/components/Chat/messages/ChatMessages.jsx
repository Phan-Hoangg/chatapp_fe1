import { useSelector } from "react-redux";
import Message from "./Message";
import { useEffect, useRef } from "react";
import Typing from "./Typing";
import FileMessage from "./files/FileMessage";

// Component ChatMessages hiển thị danh sách tin nhắn trong cuộc hội thoại hiện tại
// Nó cũng hiển thị hiệu ứng "typing" khi người dùng đang gõ
export default function ChatMessages({ typing }) {
  // Lấy danh sách tin nhắn và activeConversation từ state của chat trong Redux store
  const { messages, activeConversation } = useSelector((state) => state.chat);
  // Lấy thông tin người dùng từ Redux store
  const { user } = useSelector((state) => state.user);
  // Sử dụng useRef để tạo tham chiếu cho phần tử cuộn cuối cùng của danh sách tin nhắn
  const endRef = useRef();

  // useEffect để tự động cuộn xuống cuối mỗi khi danh sách tin nhắn hoặc trạng thái "typing" thay đổi
  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  // Hàm scrollToBottom cuộn danh sách tin nhắn xuống phần tử có ref endRef
  const scrollToBottom = () => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    // Container ngoài, có chiều cao margin dưới để dành chỗ cho thanh nhập tin nhắn,
    // sử dụng background ảnh với các lớp bg-cover và bg-no-repeat
    <div className="mb-[60px] bg-[url('https://hoanghamobile.com/tin-tuc/wp-content/webp-express/webp-images/uploads/2024/06/anh-chill-lofi-8.jpg.webp')] bg-cover bg-no-repeat">
      {/* Container chứa danh sách tin nhắn, có thanh cuộn (overflow-auto) và padding theo chiều ngang */}
      <div className="scrollbar overflow_scrollbar overflow-auto py-2 px-[5%]">
        {/* Duyệt qua danh sách tin nhắn (messages) nếu tồn tại */}
        {messages &&
          messages.map((message) => (
            // Sử dụng Fragment để gộp nhóm hiển thị file và tin nhắn text
            <>
              {/* Nếu tin nhắn chứa file (files.length > 0), hiển thị từng file bằng component FileMessage */}
              {message.files.length > 0
                ? message.files.map((file) => (
                    <FileMessage
                      // Truyền thông tin file qua prop FileMessage
                      FileMessage={file}
                      // Truyền đối tượng tin nhắn chứa file
                      message={message}
                      // Sử dụng message._id làm key (có thể cần key riêng cho mỗi file nếu có nhiều file trong 1 tin nhắn)
                      key={message._id}
                      // Kiểm tra xem tin nhắn có do chính user gửi hay không
                      me={user._id === message.sender._id}
                    />
                  ))
                : null}
              {/* Nếu tin nhắn có nội dung text (message.message.length > 0), hiển thị bằng component Message */}
              {message.message.length > 0 ? (
                <Message
                  message={message}
                  key={message._id}
                  me={user._id === message.sender._id}
                />
              ) : null}
            </>
          ))}
        {/* Nếu trạng thái "typing" khớp với activeConversation, hiển thị component Typing */}
        {typing === activeConversation._id ? <Typing /> : null}
        {/* Phần tử này dùng làm mục tiêu cuộn xuống cuối danh sách tin nhắn */}
        <div className="mt-2" ref={endRef}></div>
      </div>
    </div>
  );
}
