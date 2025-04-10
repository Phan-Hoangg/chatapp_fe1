import moment from "moment"; // Import thư viện moment để định dạng ngày giờ
import TraingleIcon from "../../../svg/triangle"; // Import icon tam giác dùng để tạo mũi tên cho tin nhắn

// Component Message hiển thị tin nhắn text của cuộc trò chuyện
// Props nhận vào:
// - message: đối tượng tin nhắn chứa nội dung, thời gian tạo, thông tin người gửi và cuộc trò chuyện
// - me: boolean cho biết tin nhắn này có do chính người dùng gửi hay không (để căn chỉnh giao diện)
export default function Message({ message, me }) {
  return (
    // Container ngoài của tin nhắn, sử dụng flexbox để căn chỉnh
    // Nếu tin nhắn được gửi bởi chính người dùng (me=true), căn lề phải (ml-auto) và căn chỉnh nội dung theo bên phải
    <div
      className={`w-full flex mt-2 space-x-3 max-w-xs ${
        me ? "ml-auto justify-end " : ""
      }`}
    >
      {/* Message Container */}
      <div className="relative">
        {/* Nếu tin nhắn không do chính người dùng gửi (me=false) và là cuộc hội thoại nhóm,
            hiển thị ảnh đại diện của người gửi bên ngoài container tin nhắn */}
        {!me && message.conversation.isGroup && (
          <div className="absolute top-0.5 left-[-37px]">
            <img
              src={message.sender.picture} // Ảnh đại diện của người gửi
              alt="" // Alt text để hỗ trợ truy cập
              className="w-8 h-8 rounded-full" // Ảnh được hiển thị ở kích thước 8x8, bo tròn
            />
          </div>
        )}
        {/* Container hiển thị nội dung tin nhắn */}
        <div
          className={`relative h-full dark:text-dark_text_1 p-2 rounded-lg
         ${me ? "bg-green_3" : "dark:bg-dark_bg_2"}
         `}
        >
          {/* Nội dung tin nhắn text */}
          <p className="float-left h-full text-sm pb-4 pr-8">
            {message.message}
          </p>
          {/* Hiển thị thời gian tin nhắn tại góc dưới bên phải của container */}
          <span className="absolute right-1.5 bottom-1.5 text-xs text-dark_text_5 leading-none">
            {moment(message.createdAt).format("HH:mm")}
          </span>
          {/* Hiển thị icon tam giác (mũi tên) nếu tin nhắn không do chính người dùng gửi */}
          {!me ? (
            <span>
              <TraingleIcon className="dark:fill-dark_bg_2 rotate-[60deg] absolute top-[-5px] -left-1.5" />
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
