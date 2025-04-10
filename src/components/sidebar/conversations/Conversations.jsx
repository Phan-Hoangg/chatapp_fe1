// Import hook useSelector từ react-redux để lấy dữ liệu từ Redux store
import { useSelector } from "react-redux";
// Import các hàm tiện ích để kiểm tra trạng thái online và lấy id của cuộc hội thoại
import { checkOnlineStatus, getConversationId } from "../../../utils/chat";
// Import component Conversation để render từng cuộc hội thoại
import Conversation from "./Conversation";

// Component Conversations hiển thị danh sách các cuộc hội thoại
// Nó nhận các props: onlineUsers (danh sách người dùng online) và typing (trạng thái "đang gõ" của người dùng)
export default function Conversations({ onlineUsers, typing }) {
  // Lấy dữ liệu từ state của chat: danh sách conversations và activeConversation (cuộc hội thoại đang active)
  const { conversations, activeConversation } = useSelector(
    (state) => state.chat
  );
  // Lấy thông tin người dùng từ Redux store (state.user)
  const { user } = useSelector((state) => state.user);

  return (
    // Container hiển thị danh sách cuộc hội thoại với class "convos" và thanh cuộn (scrollbar)
    <div className="convos scrollbar">
      <ul>
        {/* Kiểm tra nếu có conversations tồn tại */}
        {conversations &&
          // Lọc các cuộc hội thoại cần hiển thị:
          // - Hiển thị cuộc hội thoại nếu có latestMessage (tin nhắn mới nhất)
          // - Hoặc nếu cuộc hội thoại đang được active
          // - Hoặc nếu là cuộc hội thoại nhóm (isGroup == true)
          conversations
            .filter(
              (c) =>
                c.latestMessage ||
                c._id === activeConversation._id ||
                c.isGroup === true
            )
            // Duyệt qua từng cuộc hội thoại đã lọc và render component Conversation
            .map((convo) => {
              // Kiểm tra trạng thái online của đối phương (chỉ áp dụng với cuộc trò chuyện cá nhân)
              let check = checkOnlineStatus(onlineUsers, user, convo.users);
              return (
                <Conversation
                  // Truyền dữ liệu cuộc hội thoại vào component Conversation
                  convo={convo}
                  // Sử dụng _id của conversation làm key duy nhất
                  key={convo._id}
                  // Nếu không phải cuộc hội thoại nhóm và checkOnlineStatus trả về true thì set online = true, ngược lại false
                  online={!convo.isGroup && check ? true : false}
                  // Truyền trạng thái "typing" (đang gõ) từ props
                  typing={typing}
                />
              );
            })}
      </ul>
    </div>
  );
}
