import { useState } from "react";
import FileViewer from "./FileViewer"; // Component hiển thị file được chọn để xem
import HandleAndSend from "./HandleAndSend"; // Component xử lý thao tác gửi và thao tác với file (ví dụ: xoá, thay đổi file,...)
import Header from "./Header"; // Component header cho giao diện xem file
import Input from "./Input"; // Component input để nhập tin nhắn kèm theo file

// Component FilesPreview hiển thị giao diện xem trước các file đã chọn cùng với các thao tác xử lý (message, gửi file,...)
export default function FilesPreview() {
  // State lưu nội dung tin nhắn kèm file
  const [message, setMessage] = useState("");
  // State lưu index của file đang được hiển thị (để duyệt qua danh sách file)
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    // Container ngoài, được căn giữa theo chiều ngang và có padding theo chiều dọc
    <div className="relative py-2 w-full flex items-center justify-center">
      {/* Container chính chứa toàn bộ giao diện xem file */}
      <div className="w-full flex flex-col items-center">
        {/* Header: hiển thị thông tin header của giao diện xem file, có thể bao gồm tên file, số thứ tự,... */}
        <Header activeIndex={activeIndex} />
        {/* FileViewer: hiển thị file được chọn dựa trên activeIndex */}
        <FileViewer activeIndex={activeIndex} />
        <div className="w-full flex flex-col items-center">
          {/* Input: ô nhập tin nhắn kèm theo file */}
          <Input message={message} setMessage={setMessage} />
          {/* HandleAndSend: component xử lý thao tác gửi file và các thao tác liên quan,
              nhận activeIndex, setActiveIndex để cập nhật file đang chọn và message từ state */}
          <HandleAndSend
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            message={message}
          />
        </div>
      </div>
    </div>
  );
}
