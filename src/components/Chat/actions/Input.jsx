import { useState } from "react";
import { useSelector } from "react-redux";
import SocketContext from "../../../context/SocketContext";

// Component Input dùng để hiển thị ô nhập tin nhắn và xử lý sự kiện "typing"
// Nó nhận các props: message (nội dung tin nhắn hiện tại), setMessage (hàm cập nhật tin nhắn),
// textRef (ref của input), và socket (để phát sự kiện qua Socket.IO).
function Input({ message, setMessage, textRef, socket }) {
  // Lấy thông tin cuộc hội thoại đang active từ Redux store (trong state.chat)
  const { activeConversation } = useSelector((state) => state.chat);

  // State "typing" dùng để theo dõi xem người dùng có đang gõ tin nhắn hay không.
  const [typing, setTyping] = useState(false);

  // Hàm xử lý khi nội dung trong ô input thay đổi
  const onChangeHandler = (e) => {
    // Cập nhật nội dung tin nhắn từ giá trị mới của ô input
    setMessage(e.target.value);

    // Nếu chưa báo hiệu đang gõ tin nhắn, phát sự kiện "typing" qua socket và cập nhật state
    if (!typing) {
      setTyping(true);
      socket.emit("typing", activeConversation._id);
    }

    // Lưu thời điểm cuối cùng mà người dùng gõ tin nhắn
    let lastTypingTime = new Date().getTime();
    // Thiết lập khoảng thời gian (timer) là 1000ms (1 giây)
    let timer = 1000;
    
    // Đặt một hàm setTimeout để kiểm tra sau 1 giây
    setTimeout(() => {
      // Lấy thời điểm hiện tại
      let timeNow = new Date().getTime();
      // Tính hiệu số thời gian giữa hiện tại và thời điểm cuối cùng gõ
      let timeDiff = timeNow - lastTypingTime;
      // Nếu khoảng cách thời gian lớn hơn hoặc bằng timer và trạng thái vẫn "typing" thì:
      if (timeDiff >= timer && typing) {
        // Phát sự kiện "stop typing" qua socket, thông báo rằng người dùng đã dừng gõ
        socket.emit("stop typing", activeConversation._id);
        // Cập nhật lại state "typing" thành false
        setTyping(false);
      }
    }, timer);
  };

  return (
    <div className="w-full">
      {/* Ô input tin nhắn */}
      <input
        type="text"
        // Các lớp CSS để định dạng giao diện ô input (hỗ trợ chế độ tối)
        className="dark:bg-dark_hover_1 dark:text-dark_text_1 outline-none h-[45px] w-full flex-1 rounded-lg pl-4"
        placeholder="Type a message"
        value={message}
        onChange={onChangeHandler}
        ref={textRef} // Gán ref để có thể truy cập trực tiếp tới DOM element của input
      />
    </div>
  );
}

// Component InputWithSocket bọc component Input sử dụng SocketContext.Consumer để lấy đối tượng socket từ context.
const InputWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Input {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default InputWithSocket;
