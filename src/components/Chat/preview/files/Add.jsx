import { useRef } from "react"; // Dùng useRef để tạo tham chiếu tới phần tử input file
import { CloseIcon } from "../../../../svg"; // Import icon CloseIcon để hiển thị trên nút bấm
import { useDispatch } from "react-redux"; // Import useDispatch để dispatch các action của Redux
import { addFiles } from "../../../../features/chatSlice"; // Import action addFiles từ chatSlice để thêm file vào state chat
import { getFileType } from "../../../../utils/file"; // Import hàm getFileType để xác định loại file dựa trên MIME type

export default function Add() {
  // Khởi tạo dispatch để gửi action lên Redux store
  const dispatch = useDispatch();
  // Tạo một ref cho input file để có thể kích hoạt click một cách thủ công
  const inputRef = useRef(null);

  // Hàm xử lý khi người dùng chọn file (sự kiện onChange của input)
  const filestHandler = (e) => {
    // Chuyển đổi FileList từ e.target.files thành mảng các file
    let files = Array.from(e.target.files);

    // Duyệt qua từng file trong mảng
    files.forEach((file) => {
      // Kiểm tra định dạng của file: chỉ cho phép các định dạng sau
      //  - Các file văn bản: application/pdf, text/plain, application/msword,
      //    application/vnd.openxmlformats-officedocument.wordprocessingml.document
      //  - Các file thuyết trình: application/vnd.ms-powerpoint,
      //    application/vnd.openxmlformats-officedocument.presentationml.presentation
      //  - Các file bảng tính: application/vnd.ms-excel,
      //    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
      //  - Các file nén: application/vnd.rar, application/zip
      //  - Các file âm thanh: audio/mpeg, audio/wav
      //  - Các file ảnh: image/png, image/jpeg, image/gif, image/webp
      //  - Các file video: video/mp4, video/mpeg, image/webm, image/webp (lưu ý "image/webp" được liệt kê 2 lần)
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
        file.type !== "audio/wav" &&
        file.type !== "image/png" &&
        file.type !== "image/jpeg" &&
        file.type !== "image/gif" &&
        file.type !== "image/webp" &&
        file.type !== "video/mp4" &&
        file.type !== "video/mpeg" &&
        file.type !== "image/webm" &&
        file.type !== "image/webp"
      ) {
        // Nếu file không thuộc các định dạng cho phép, loại bỏ file đó khỏi mảng
        files = files.filter((item) => item.name !== file.name);
        return;
      }
      // Kiểm tra kích thước file: chỉ cho phép file có kích thước tối đa 10MB
      else if (file.size > 1024 * 1024 * 10) {
        // Nếu file quá lớn, loại bỏ file đó khỏi mảng
        files = files.filter((item) => item.name !== file.name);
        return;
      } else {
        // Nếu file hợp lệ, sử dụng FileReader để đọc file dưới dạng Data URL
        const reader = new FileReader();
        reader.readAsDataURL(file);
        // Khi quá trình đọc file hoàn tất, dispatch action addFiles với thông tin file
        reader.onload = (e) => {
          dispatch(
            addFiles({
              file: file, // File gốc
              // Nếu file là ảnh (loại được xác định bằng getFileType trả về "IMAGE"),
              // thì truyền dữ liệu file đã được chuyển sang Data URL, ngược lại để trống
              fileData:
                getFileType(file.type) === "IMAGE" ? e.target.result : "",
              type: getFileType(file.type), // Xác định loại file (IMAGE, PDF, DOCX, v.v.)
            })
          );
        };
      }
    });
  };

  return (
    <>
      {/* Nút bấm hiển thị icon CloseIcon (được xoay 45 độ) */}
      <div
        onClick={() => inputRef.current.click()} // Khi nhấn nút, kích hoạt click trên input file ẩn
        className="w-14 h-14 mt-2 border dark:border-white rounded-md flex items-center justify-center cursor-pointer"
      >
        <span className="rotate-45">
          <CloseIcon className="dark:fill-dark_svg_1" />
        </span>
      </div>
      {/* Input file ẩn: cho phép chọn nhiều file với các định dạng được chỉ định */}
      <input
        type="file"
        hidden
        multiple
        ref={inputRef}
        accept="application/*,text/plain,image/png,image/jpeg,image/gif,image/webp,video/mp4,video/mpeg"
        onChange={filestHandler} // Gọi hàm filestHandler khi có file được chọn
      />
    </>
  );
}
