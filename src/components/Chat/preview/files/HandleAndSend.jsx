import { useDispatch, useSelector } from "react-redux";
import Add from "./Add"; // Component cho phép thêm file mới vào danh sách file đính kèm
import { CloseIcon, SendIcon } from "../../../../svg"; // Import các icon Close và Send
import { uploadFiles } from "../../../../utils/upload"; // Hàm uploadFiles xử lý việc upload file lên Cloudinary (hoặc server)
import { useState } from "react";
import {
  removeFileFromFiles,
  sendMessage,
} from "../../../../features/chatSlice"; // Các action của chatSlice để xóa file và gửi tin nhắn
import SocketContext from "../../../../context/SocketContext"; // Context để cung cấp đối tượng socket cho component
import ClipLoader from "react-spinners/ClipLoader"; // Loader hiển thị khi đang loading
import ThumbnailGenerator from "react-thumbnail-generator"; // Component tạo thumbnail cho video

// Component HandleAndSend hiển thị giao diện xử lý file đính kèm và gửi tin nhắn
// Props nhận vào:
// - activeIndex: chỉ số của file hiện đang được chọn để xem
// - setActiveIndex: hàm cập nhật activeIndex
// - message: nội dung tin nhắn nhập vào
// - socket: đối tượng socket được lấy từ context để giao tiếp thời gian thực
function HandleAndSend({ activeIndex, setActiveIndex, message, socket }) {
  const dispatch = useDispatch();
  // State loading để hiển thị loader khi gửi tin nhắn
  const [loading, setLoading] = useState(false);
  // Lấy danh sách file đính kèm và activeConversation từ state của chat (Redux store)
  const { files, activeConversation } = useSelector((state) => state.chat);
  // Lấy thông tin người dùng từ Redux store
  const { user } = useSelector((state) => state.user);
  const { token } = user;

  // Hàm xử lý khi gửi tin nhắn
  const sendMessageHandler = async (e) => {
    e.preventDefault(); // Ngăn chặn hành động mặc định của form
    setLoading(true); // Đặt trạng thái loading khi bắt đầu gửi tin nhắn

    // Upload các file đính kèm lên server/Cloudinary trước khi gửi tin nhắn
    const uploaded_files = await uploadFiles(files);
    // Tạo đối tượng values chứa thông tin cần thiết để gửi tin nhắn
    const values = {
      token,
      message,
      convo_id: activeConversation._id,
      files: uploaded_files.length > 0 ? uploaded_files : [],
    };
    // Dispatch action sendMessage với thông tin tin nhắn
    let newMsg = await dispatch(sendMessage(values));
    // Phát sự kiện "send message" qua socket để thông báo cho các client khác
    socket.emit("send message", newMsg.payload);
    setLoading(false); // Tắt trạng thái loading sau khi gửi tin nhắn
  };

  // Hàm xử lý xóa file khỏi danh sách file đính kèm dựa trên index
  const handleRemoveFile = (index) => {
    dispatch(removeFileFromFiles(index));
  };

  return (
    <div className="w-[97%] flex items-center justify-between mt-2 border-t dark:border-dark_border_2">
      {/* Phần bên trái: có thể hiển thị khoảng trống hoặc thông tin bổ sung (hiện không có gì) */}
      <span></span>
      {/* Phần hiển thị danh sách file đính kèm */}
      <div className="flex items-center gap-x-2">
        {files.map((file, i) => (
          <div
            key={i}
            // Container hiển thị thumbnail của file, được định dạng với kích thước cố định, viền, bo tròn, và overflow-hidden
            // Nếu file đang được chọn (activeIndex === i) sẽ hiển thị viền nổi bật
            className={`fileThumbnail relative w-14 h-14 border dark:border-white mt-2 rounded-md overflow-hidden cursor-pointer
             ${activeIndex === i ? "border-[3px] !border-green_1" : ""}`}
            // Khi nhấn vào thumbnail, cập nhật activeIndex để đánh dấu file được chọn
            onClick={() => setActiveIndex(i)}
          >
            {file.type === "IMAGE" ? (
              // Nếu file là ảnh, hiển thị thẻ <img> với fileData làm src
              <img
                src={file.fileData}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : file.type === "VIDEO" ? (
              // Nếu file là video, sử dụng ThumbnailGenerator để tạo hình thu nhỏ của video
              <ThumbnailGenerator
                videoUrl={file.fileData}
                snapshotAtTime={2} // Lấy ảnh ở giây thứ 2 của video
                width={100}
                height={100}
              />
            ) : (
              // Nếu file thuộc loại khác, hiển thị icon file dựa trên type
              <img
                src={`../../../../images/file/${file.type}.png`}
                alt=""
                className="w-8 h-10 mt-1.5 ml-2.5"
              />
            )}
            {/* Icon để xóa file: khi nhấn vào biểu tượng này, gọi handleRemoveFile */}
            <div
              className="removeFileIcon hidden" // Lớp "hidden" để ẩn icon này theo mặc định (có thể hiển thị khi hover)
              onClick={() => handleRemoveFile(i)}
            >
              <CloseIcon className="dark:fill-white absolute right-0 top-0 w-4 h-4" />
            </div>
          </div>
        ))}
        {/* Component Add để thêm file mới */}
        <Add setActiveIndex={setActiveIndex} />
      </div>
      {/* Nút gửi tin nhắn */}
      <div
        className="bg-green_1 w-16 h-16 mt-2 rounded-full flex items-center justify-center cursor-pointer"
        onClick={(e) => sendMessageHandler(e)}
      >
        {loading ? (
          // Nếu đang loading, hiển thị loader
          <ClipLoader color="#E9EDEF" size={25} />
        ) : (
          // Nếu không, hiển thị icon gửi tin (SendIcon)
          <SendIcon className="fill-white" />
        )}
      </div>
    </div>
  );
}

// Component bọc HandleAndSend với SocketContext để lấy đối tượng socket từ context
const HandleAndSendWithContext = (props) => (
  <SocketContext.Consumer>
    {(socket) => <HandleAndSend {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default HandleAndSendWithContext;
