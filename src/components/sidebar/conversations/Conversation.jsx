import { useDispatch, useSelector } from "react-redux";
import SocketContext from "../../../context/SocketContext";
// Action mở cuộc hội thoại hoặc tạo cuộc hội thoại mới từ chatSlice
import { open_create_conversation } from "../../../features/chatSlice";
// Các hàm tiện ích để lấy thông tin của cuộc hội thoại (ID, tên, ảnh đại diện)
import {
  getConversationId,
  getConversationName,
  getConversationPicture,
} from "../../../utils/chat";
// Hàm xử lý định dạng ngày tháng hiển thị
import { dateHandler } from "../../../utils/date";
// Hàm viết hoa chữ cái đầu tiên của chuỗi
import { capitalize } from "../../../utils/string";

function Conversation({ convo, socket, online, typing }) {
  // Khởi tạo dispatch để gửi action lên Redux store
  const dispatch = useDispatch();
  // Lấy thông tin người dùng từ Redux store (state.user)
  const { user } = useSelector((state) => state.user);
  // Lấy thông tin cuộc hội thoại đang active từ Redux store (state.chat)
  const { activeConversation } = useSelector((state) => state.chat);
  // Lấy token của người dùng để xác thực trong backend khi mở cuộc hội thoại
  const { token } = user;

  // Tạo đối tượng values chứa các thông tin cần thiết để mở hoặc tạo cuộc hội thoại
  // - receiver_id: ID của người nhận (đối với chat cá nhân)
  // - isGroup: Nếu là cuộc hội thoại nhóm, lấy ID của cuộc hội thoại, nếu không thì false
  // - token: Token của người dùng để xác thực
  const values = {
    receiver_id: getConversationId(user, convo.users),
    isGroup: convo.isGroup ? convo._id : false,
    token,
  };

  // Hàm mở cuộc hội thoại khi người dùng click vào một cuộc hội thoại cụ thể
  const openConversation = async () => {
    // Dispatch action open_create_conversation với giá trị values
    let newConvo = await dispatch(open_create_conversation(values));
    // Khi đã mở hoặc tạo cuộc hội thoại, socket tham gia room của cuộc hội thoại đó
    socket.emit("join conversation", newConvo.payload._id);
  };

  return (
    <li
      onClick={() => openConversation()}
      className={`list-none h-[72px] w-full dark:bg-dark_bg_1 hover:${
        convo._id !== activeConversation._id ? "dark:bg-dark_bg_2" : ""
      } cursor-pointer dark:text-dark_text_1 px-[10px] ${
        convo._id === activeConversation._id ? "dark:bg-dark_hover_1" : ""
      }`}
    >
      {/* Container chứa thông tin cuộc hội thoại */}
      <div className="relative w-full flex items-center justify-between py-[10px]">
        {/* Phần bên trái: ảnh đại diện và thông tin cuộc hội thoại */}
        <div className="flex items-center gap-x-3">
          {/* Hình đại diện của cuộc hội thoại */}
          <div
            className={`relative min-w-[50px] max-w-[50px] h-[50px] rounded-full overflow-hidden ${
              online ? "online" : ""
            }`}
          >
            <img
              // Nếu là nhóm thì dùng ảnh được lưu trong convo.picture,
              // nếu là chat cá nhân thì sử dụng hàm getConversationPicture để lấy ảnh của đối phương.
              src={
                convo.isGroup
                  ? convo.picture
                  : getConversationPicture(user, convo.users)
              }
              alt="picture"
              className="w-full h-full object-cover "
            />
          </div>
          {/* Thông tin tên cuộc hội thoại và tin nhắn mới nhất */}
          <div className="w-full flex flex-col">
            {/* Tên cuộc hội thoại */}
            <h1 className="font-bold flex items-center gap-x-2">
              {convo.isGroup
                ? convo.name
                : capitalize(getConversationName(user, convo.users))}
            </h1>
            {/* Tin nhắn mới nhất của cuộc hội thoại */}
            <div>
              <div className="flex items-center gap-x-1 dark:text-dark_text_2">
                <div className="flex-1 items-center gap-x-1 dark:text-dark_text_2">
                  {/* Nếu cuộc hội thoại đang có trạng thái "typing" (người nhận đang gõ), hiển thị "Typing..." */}
                  {typing === convo._id ? (
                    <p className="text-green_1">Typing...</p>
                  ) : (
                    // Ngược lại hiển thị tin nhắn mới nhất. Nếu tin nhắn dài quá 25 ký tự, cắt bớt và thêm dấu "..."
                    <p>
                      {convo.latestMessage?.message.length > 25
                        ? `${convo.latestMessage?.message.substring(0, 25)}...`
                        : convo.latestMessage?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Phần bên phải: hiển thị thời gian tin nhắn mới nhất */}
        <div className="flex flex-col gap-y-4 items-end text-xs">
          <span className="dark:text-dark_text_2">
            {/* Nếu tin nhắn mới nhất có thời gian tạo, hiển thị thời gian được định dạng */}
            {convo.latestMessage?.createdAt
              ? dateHandler(convo.latestMessage?.createdAt)
              : ""}
          </span>
        </div>
      </div>
      {/* Vạch chân dưới để phân cách các cuộc hội thoại */}
      <div className="ml-16 border-b dark:border-b-dark_border_1"></div>
    </li>
  );
}

// Component bọc Conversation sử dụng SocketContext để lấy đối tượng socket từ context
const ConversationWithContext = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Conversation {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default ConversationWithContext;
