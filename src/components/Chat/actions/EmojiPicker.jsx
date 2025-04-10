// Import EmojiPicker từ thư viện emoji-picker-react để hiển thị bộ chọn emoji
import EmojiPicker from "emoji-picker-react";
// Import hook useEffect và useState từ React để quản lý state và side effects
import { useEffect, useState } from "react";
// Import các icon được sử dụng: CloseIcon và EmojiIcon
import { CloseIcon, EmojiIcon } from "../../../svg";

// Component EmojiPickerApp hiển thị nút bật/tắt bộ chọn emoji và xử lý việc chèn emoji vào ô input tin nhắn
// Các props nhận vào bao gồm:
// - textRef: ref của ô input để có thể chèn emoji vào vị trí con trỏ hiện tại
// - message: nội dung tin nhắn hiện tại
// - setMessage: hàm cập nhật nội dung tin nhắn
// - showPicker: state xác định xem bộ chọn emoji có đang hiển thị hay không
// - setShowPicker: hàm cập nhật state hiển thị bộ chọn emoji
// - setShowAttachments: hàm cập nhật hiển thị menu đính kèm (để ẩn khi hiển thị emoji picker)
export default function EmojiPickerApp({
  textRef,
  message,
  setMessage,
  showPicker,
  setShowPicker,
  setShowAttachments,
}) {
  // State lưu vị trí con trỏ trong ô input
  const [cursorPosition, setCursorPosition] = useState();

  // useEffect để cập nhật vị trí con trỏ trong ô input mỗi khi cursorPosition thay đổi
  useEffect(() => {
    // Đặt vị trí con trỏ tại vị trí đã lưu
    textRef.current.selectionEnd = cursorPosition;
  }, [cursorPosition, textRef]);

  // Hàm xử lý khi người dùng chọn một emoji từ EmojiPicker
  // emojiData chứa thông tin emoji được chọn, e là sự kiện (không dùng)
  const handleEmoji = (emojiData, e) => {
    const { emoji } = emojiData; // Lấy emoji (chuỗi ký tự emoji)
    const ref = textRef.current;
    // Đảm bảo ô input được focus để con trỏ hiển thị đúng vị trí
    ref.focus();
    // Lấy phần text bên trái và bên phải của vị trí con trỏ hiện tại
    const start = message.substring(0, ref.selectionStart);
    const end = message.substring(ref.selectionStart);
    // Chèn emoji vào giữa hai phần text này
    const newText = start + emoji + end;
    // Cập nhật nội dung tin nhắn mới sau khi chèn emoji
    setMessage(newText);
    // Cập nhật vị trí con trỏ sau khi chèn emoji, vị trí mới là độ dài của phần text bên trái cộng độ dài emoji
    setCursorPosition(start.length + emoji.length);
  };

  return (
    <li>
      {/* Nút bấm để bật/tắt Emoji Picker */}
      <button
        className="btn"
        type="button"
        onClick={() => {
          // Khi nhấn nút, ẩn menu đính kèm nếu đang hiển thị
          setShowAttachments(false);
          // Đảo ngược trạng thái hiển thị của Emoji Picker (nếu đang hiện thì ẩn, nếu ẩn thì hiện)
          setShowPicker((prev) => !prev);
        }}
      >
        {/* Nếu Emoji Picker đang hiển thị, hiển thị CloseIcon, nếu không thì hiển thị EmojiIcon */}
        {showPicker ? (
          <CloseIcon className="dark:fill-dark_svg_1" />
        ) : (
          <EmojiIcon className="dark:fill-dark_svg_1" />
        )}
      </button>
      {/* Hiển thị bộ chọn emoji nếu showPicker là true */}
      {showPicker ? (
        <div className="openEmojiAnimation absolute bottom-[60px] left-[-0.5px]">
          {/* Component EmojiPicker được thiết lập theme là dark */}
          <EmojiPicker theme="dark" onEmojiClick={handleEmoji} />
        </div>
      ) : null}
    </li>
  );
}
