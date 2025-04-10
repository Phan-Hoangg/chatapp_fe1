import { useEffect, useState } from "react";
import { CloseIcon, ValidIcon } from "../../../svg";

// Component Ringing hiển thị giao diện cuộc gọi đến (ringing) với thông tin người gọi, đồng thời cho phép trả lời hoặc từ chối cuộc gọi
// Props nhận vào:
// - call: đối tượng chứa thông tin cuộc gọi (receiveingCall, callEnded, name, picture, ...)
// - setCall: hàm cập nhật đối tượng call trong state
// - answerCall: hàm xử lý khi người dùng trả lời cuộc gọi
// - endCall: hàm xử lý khi người dùng từ chối hoặc kết thúc cuộc gọi
export default function Ringing({ call, setCall, answerCall, endCall }) {
  // Giải cấu trúc các thuộc tính từ đối tượng call
  const { receiveingCall, callEnded, name, picture } = call;
  // State timer để đếm số giây đã trôi qua kể từ khi cuộc gọi đến
  const [timer, setTimer] = useState(0);
  let interval; // Biến lưu trữ interval dùng cho setInterval

  // Hàm handleTimer: thiết lập setInterval để tăng giá trị timer mỗi giây
  const handleTimer = () => {
    interval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
  };

  console.log(timer); // Log timer ra console (có thể dùng cho mục đích debug)

  // useEffect để theo dõi state timer
  useEffect(() => {
    // Nếu timer nhỏ hơn hoặc bằng 30 giây, tiếp tục đếm
    if (timer <= 30) {
      handleTimer();
    } else {
      // Nếu timer vượt quá 30 giây, kết thúc việc nhận cuộc gọi
      setCall({ ...call, receiveingCall: false });
    }
    // Cleanup: xóa interval khi component unmount hoặc khi timer thay đổi
    return () => clearInterval(interval);
  }, [timer]);

  return (
    // Container chính của giao diện Ringing, được căn giữa trên màn hình, có hiệu ứng bóng đổ (shadow) và bo tròn các góc
    <div className="dark:bg-dark_bg_1 rounded-lg fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg z-30">
      {/* Container chứa thông tin cuộc gọi */}
      <div className="p-4 flex items-center justify-between gap-x-8">
        {/* Phần hiển thị thông tin người gọi */}
        <div className="flex items-center gap-x-2">
          {/* Ảnh đại diện của người gọi */}
          <img
            src={picture}
            alt={`caller profile picture`}
            className="w-28 h-28 rounded-full"
          />
          <div>
            {/* Hiển thị tên người gọi */}
            <h1 className="dark:text-white">
              <b>{name}</b>
            </h1>
            {/* Thông báo trạng thái cuộc gọi */}
            <span className="dark:text-dark_text_2">Chatapp video...</span>
          </div>
        </div>
        {/* Phần hiển thị các hành động cuộc gọi (trả lời hoặc kết thúc cuộc gọi) */}
        <ul className="flex items-center gap-x-2">
          {/* Nút kết thúc cuộc gọi (từ chối hoặc hủy cuộc gọi) */}
          <li onClick={endCall}>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500">
              <CloseIcon className="fill-white w-5" />
            </button>
          </li>
          {/* Nút trả lời cuộc gọi */}
          <li onClick={answerCall}>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500">
              <ValidIcon className="fill-white w-6 mt-2" />
            </button>
          </li>
        </ul>
      </div>
      {/* Phát ringtone: sử dụng thẻ <audio> với thuộc tính autoPlay và loop để lặp lại âm thanh */}
      <audio src="../../../../audio/ringtone.mp3" autoPlay loop></audio>
    </div>
  );
}
