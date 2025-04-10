import moment from "moment"; // Import thư viện moment để định dạng ngày giờ
import TraingleIcon from "../../../../svg/triangle"; // Import icon hình tam giác dùng làm mũi tên chỉ hướng tin nhắn
import FileImageVideo from "./FileImageVideo"; // Import component hiển thị file ảnh hoặc video
import FileOthers from "./FileOthers"; // Import component hiển thị các loại file khác

// Component FileMessage hiển thị tin nhắn chứa file (có thể là ảnh, video hoặc file khác)
// Props:
// - FileMessage: đối tượng chứa thông tin file (bao gồm file, type, public_id,...)
// - message: đối tượng tin nhắn chứa thông tin về tin nhắn (bao gồm createdAt, conversation, sender,...)
// - me: boolean cho biết tin nhắn này do chính user gửi hay không (true nếu gửi bởi chính user)
export default function FileMessage({ FileMessage, message, me }) {
  // Giải cấu trúc file và type từ FileMessage
  const { file, type } = FileMessage;
  
  return (
    // Container ngoài của tin nhắn, căn chỉnh theo chiều rộng đầy đủ, khoảng cách, z-index,...
    // Nếu tin nhắn do "me" gửi thì căn lề phải (ml-auto) và justify-end
    <div
      className={`w-full flex mt-2 space-x-3 max-w-xs z-10 ${
        me ? "ml-auto justify-end " : ""
      }`}
    >
      {/* Message Container */}
      <div className="relative">
         {/* Nếu tin nhắn không do chính user gửi và là cuộc trò chuyện nhóm,
             hiển thị ảnh đại diện của người gửi bên ngoài container tin nhắn */}
         {!me && message.conversation.isGroup && (
           <div className="absolute top-0.5 left-[-37px]">
             <img
               src={message.sender.picture} // Ảnh đại diện của người gửi
               alt=""
               className="w-8 h-8 rounded-full"
             />
           </div>
         )}
         
         {/* Container hiển thị nội dung tin nhắn */}
        <div
          className={`relative h-full dark:text-dark_text_1 rounded-lg
           ${me ? " border border-green_3" : "dark:bg-dark_bg_2"}
         ${
           // Nếu tin nhắn do chính user gửi và file có đuôi là "png", sử dụng nền trắng, 
           // ngược lại sử dụng nền xanh lá với padding
           me && file.public_id.split(".")[1] === "png"
             ? "bg-white"
             : "bg-green_3 p-1"
         }
         `}
        >
          {/* Nội dung tin nhắn */}
          <p
            className={`h-full text-sm ${
              // Nếu loại file không phải IMAGE hoặc VIDEO, thêm padding dưới để chừa không gian cho thời gian hiển thị
              type !== "IMAGE" && type !== "VIDEO" ? "pb-5" : ""
            }`}
          >
            {type === "IMAGE" || type === "VIDEO" ? (
              // Nếu file là ảnh hoặc video, hiển thị bằng component FileImageVideo
              <FileImageVideo url={file.secure_url} type={type} />
            ) : (
              // Nếu file thuộc các loại khác, hiển thị bằng component FileOthers
              <FileOthers file={file} type={type} me={me} />
            )}
          </p>
          {/* Hiển thị thời gian tin nhắn ở góc dưới bên phải */}
          <span className="absolute right-1.5 bottom-1.5 text-xs text-dark_text_5 leading-none">
            {moment(message.createdAt).format("HH:mm")}
          </span>
          {/* Hiển thị icon tam giác (mũi tên) nếu tin nhắn không phải do chính user gửi */}
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
