// Import hook useRef từ React để tạo tham chiếu cho phần tử input
import { useRef } from "react";
// Import biểu tượng PhotoIcon được sử dụng để hiển thị trên nút bấm
import { PhotoIcon } from "../../../../../svg";
// Import useDispatch của Redux để gửi action lên store
import { useDispatch } from "react-redux";
// Import action addFiles từ chatSlice, dùng để thêm file vào state chat
import { addFiles } from "../../../../../features/chatSlice";
// Import hàm getFileType để xác định loại file dựa trên MIME type của file
import { getFileType } from "../../../../../utils/file";

// Component PhotoAttachment cho phép người dùng tải lên ảnh hoặc video cho tin nhắn
export default function PhotoAttachment() {
  // Khởi tạo dispatch để gửi action Redux
  const dispatch = useDispatch();
  // Tạo một ref cho input file để kích hoạt sự kiện click thủ công khi nhấn nút
  const inputRef = useRef(null);

  // Hàm xử lý khi người dùng chọn file (sự kiện onChange của input file)
  const imageHandler = (e) => {
    // Chuyển đổi FileList từ e.target.files thành mảng các file
    let files = Array.from(e.target.files);

    // Duyệt qua từng file trong mảng files
    files.forEach((file) => {
      // Kiểm tra định dạng file: chỉ chấp nhận các định dạng ảnh và video sau
      // - Ảnh: image/png, image/jpeg, image/gif, image/webp
      // - Video: video/mp4, video/mpeg, image/webm (có thể xem như file video hoặc ảnh động)
      // Lưu ý: "image/webp" được liệt kê 2 lần, có thể là dư thừa.
      if (
        file.type !== "image/png" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/gif" &&
        file.type !== "image/webp" &&
        file.type !== "video/mp4" &&
        file.type !== "video/mpeg" &&
        file.type !== "image/webm" &&
        file.type !== "image/webp"
      ) {
        // Nếu file không thuộc các định dạng cho phép, loại bỏ file đó khỏi mảng files
        files = files.filter((item) => item.name !== file.name);
        return;
      }
      // Kiểm tra kích thước file: chỉ chấp nhận file có kích thước tối đa 10MB
      else if (file.size > 1024 * 1024 * 10) {
        // Nếu file quá lớn, loại bỏ file đó khỏi mảng files
        files = files.filter((item) => item.name !== file.name);
        return;
      } else {
        // Nếu file hợp lệ, sử dụng FileReader để đọc file dưới dạng Data URL
        const reader = new FileReader();
        // Đọc file dưới dạng Data URL (chuỗi base64)
        reader.readAsDataURL(file);
        // Khi quá trình đọc file hoàn tất
        reader.onload = (e) => {
          // Gửi action addFiles với thông tin file, dữ liệu file (Data URL) và loại file
          dispatch(
            addFiles({
              file: file,
              fileData: e.target.result, // Dữ liệu file đã được chuyển sang Data URL
              type: getFileType(file.type), // Xác định loại file dựa trên MIME type
            })
          );
        };
      }
    });
  };

  return (
    <li>
      {/* Nút bấm có background màu, khi click sẽ kích hoạt input file ẩn */}
      <button
        type="button"
        className="bg-[#BF59CF] rounded-full"
        onClick={() => inputRef.current.click()}
      >
        <PhotoIcon />
      </button>
      {/* Input file ẩn, cho phép chọn nhiều file, chỉ chấp nhận các định dạng được liệt kê */}
      <input
        type="file"
        hidden
        multiple
        ref={inputRef}
        accept="image/png,image/jpeg,image/gif,image/webp,video/mp4,video/mpeg"
        onChange={imageHandler}
      />
    </li>
  );
}
