import moment from "moment"; // Import moment (trong trường hợp này không sử dụng, có thể loại bỏ)
import { BeatLoader } from "react-spinners"; // Import BeatLoader để hiển thị animation khi "typing"
import TraingleIcon from "../../../svg/triangle"; // Import icon tam giác dùng làm mũi tên của tin nhắn

// Component Typing hiển thị hiệu ứng animation "đang gõ" trong cuộc trò chuyện
// Prop message có thể được sử dụng nếu cần hiển thị thông tin bổ sung (trong code hiện tại không sử dụng)
export default function Typing({ message }) {
  return (
    // Container ngoài hiển thị tin nhắn "typing" với các lớp CSS căn chỉnh
    <div className={`w-full flex mt-2 space-x-3 max-w-xs`}>
      {/* Message Container */}
      <div>
        {/* Container nội dung tin nhắn, định dạng với padding, bo tròn và nền dark */}
        <div
          className={`relative h-full dark:text-dark_text_1 p-2 rounded-lg dark:bg-dark_bg_2`}
        >
          {/* Hiển thị animation "typing" sử dụng BeatLoader */}
          <BeatLoader color="#fff" size={10} />
          {/* Hiển thị icon tam giác làm mũi tên chỉ vào tin nhắn */}
          <span>
            <TraingleIcon className="dark:fill-dark_bg_2 rotate-[60deg] absolute top-[-5px] -left-1.5" />
          </span>
        </div>
      </div>
    </div>
  );
}
