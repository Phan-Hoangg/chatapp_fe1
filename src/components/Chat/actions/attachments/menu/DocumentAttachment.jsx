// Import useRef hook từ React để tạo tham chiếu cho input file
import { useRef } from "react";
// Import biểu tượng DocumentIcon được định nghĩa trong thư mục svg
import { DocumentIcon } from "../../../../../svg";
// Import action addFiles từ chatSlice để thêm file vào state của chat
import { addFiles } from "../../../../../features/chatSlice";
// Import useDispatch để gửi action Redux
import { useDispatch } from "react-redux";
// Import hàm getFileType để xác định loại file dựa trên file.type
import { getFileType } from "../../../../../utils/file";

// Component DocumentAttachment dùng để xử lý upload file tài liệu và dispatch file đó lên Redux store
export default function DocumentAttachment() {
  // Khởi tạo dispatch để gửi action
  const dispatch = useDispatch();
  // Tạo một ref cho input file để kích hoạt click một cách thủ công
  const inputRef = useRef();

  // Hàm xử lý khi người dùng chọn file tài liệu
  const documentHandler = (e) => {
    // Chuyển đổi FileList từ e.target.files thành mảng các file
    let files = Array.from(e.target.files);

    // Lặp qua từng file được chọn
    files.forEach((file) => {
      // Kiểm tra định dạng file: chỉ cho phép một số loại tài liệu và âm thanh nhất định
      if (
        file.type !== "application/pdf" &&
        file.type !== "text/plain" &&
        file.type !== "application/msword" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" &&
        file.type !== "application/vnd.ms-powerpoint" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.presentationml.presentation" &&
        file.type !== "application/vnd.ms-excel" &&
        file.type !==
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
        file.type !== "application/vnd.rar" &&
        file.type !== "application/zip" &&
        file.type !== "audio/mpeg" &&
        file.type !== "audio/wav"
      ) {
        // Nếu file không thuộc định dạng được phép, loại bỏ file đó khỏi mảng files
        files = files.filter((item) => item.name !== file.name);
        console.log(file.type); // Log định dạng file không hợp lệ
        return;
      }
      // Kiểm tra kích thước file: giới hạn tối đa 10MB
      else if (file.size > 1024 * 1024 * 10) {
        // Nếu file quá lớn, loại bỏ file đó khỏi mảng files
        files = files.filter((item) => item.name !== file.name);
        return;
      } else {
        // Nếu file hợp lệ, sử dụng FileReader để đọc file dưới dạng Data URL (để có thể xử lý hoặc preview nếu cần)
        const reader = new FileReader();
        reader.readAsDataURL(file);
        // Khi quá trình đọc file hoàn tất, dispatch action addFiles với file và loại file được xác định
        reader.onload = (e) => {
          dispatch(
            addFiles({
              file: file,
              type: getFileType(file.type),
            })
          );
        };
      }
    });
  };

  return (
    <li>
      {/* Nút bấm hiển thị biểu tượng DocumentIcon và kích hoạt click cho input file khi nhấn */}
      <button
        type="button"
        className="bg-[#5F66CD] rounded-full"
        onClick={() => inputRef.current.click()}
      >
        <DocumentIcon />
      </button>
      {/* Input file ẩn để chọn file, hỗ trợ chọn nhiều file và chỉ chấp nhận các định dạng được chỉ định */}
      <input
        type="file"
        hidden
        multiple
        ref={inputRef}
        accept="application/*,text/plain"
        onChange={documentHandler}
      />
    </li>
  );
}
