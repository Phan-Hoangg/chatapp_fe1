import { useSelector } from "react-redux";

// Hàm formatFileSize chuyển đổi kích thước file từ bytes sang định dạng dễ đọc (B, KB, MB, GB, TB)
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"]; // Danh sách các đơn vị kích thước
  // Tính chỉ số i dựa trên logarithm để xác định đơn vị phù hợp
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  // Chia bytes cho 1024^i, làm tròn đến 2 chữ số thập phân và nối với đơn vị
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

// Component FileViewer hiển thị bản xem trước của file được chọn
// activeIndex: chỉ số của file hiện đang được xem trong mảng files của state.chat
export default function FileViewer({ activeIndex }) {
  // Lấy danh sách file từ Redux store (state.chat)
  const { files } = useSelector((state) => state.chat);

  // Nếu không có file nào trong state hoặc file ở activeIndex không tồn tại, hiển thị thông báo "No file selected"
  if (!files || !files[activeIndex]) {
    return (
      <div className="w-full max-w-[60%] flex justify-center items-center">
        <h1 className="text-xl text-gray-500">No file selected</h1>
      </div>
    );
  }

  return (
    // Container chính của FileViewer, giới hạn chiều rộng tối đa 60%
    <div className="w-full max-w-[60%]">
      <div className="flex justify-center items-center">
        {files[activeIndex].type === "IMAGE" ? (
          // Nếu file có type là "IMAGE", hiển thị thẻ <img> với src là fileData
          <img
            src={files[activeIndex].fileData}
            alt=""
            className="max-w-[80%] object-contain hview"
          />
        ) : files[activeIndex].type === "VIDEO" ? (
          // Nếu file có type là "VIDEO", hiển thị thẻ <video> với thuộc tính controls
          <video
            src={files[activeIndex].fileData}
            controls
            className="max-w-[80%] object-contain hview"
          ></video>
        ) : (
          // Nếu file thuộc các loại khác, hiển thị giao diện thông báo không có preview
          <div className="min-w-full hview flex flex-col items-center justify-center">
            {/* Hiển thị icon đại diện file dựa trên type (ví dụ: PDF.png, DOCX.png, v.v.) */}
            <img
              src={`../../../../images/file/${files[activeIndex].type}.png`}
              alt={files[activeIndex].type}
            />
            {/* Thông báo không có preview */}
            <h1 className="dark:text-dark_text_2 text-2xl">
              No preview available
            </h1>
            {/* Hiển thị kích thước file và type */}
            <span className="dark:text-dark_text_2">
              {formatFileSize(files[activeIndex]?.file?.size)} -{" "}
              {files[activeIndex]?.type}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
