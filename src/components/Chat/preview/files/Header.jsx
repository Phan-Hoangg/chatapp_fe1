import { useDispatch, useSelector } from "react-redux"; // Import các hook để truy cập Redux store
import { CloseIcon } from "../../../../svg"; // Import icon CloseIcon từ thư mục svg
import { clearFiles } from "../../../../features/chatSlice"; // Import action clearFiles từ chatSlice để xóa file đính kèm

// Component Header hiển thị phần header của giao diện xem file
// Props: activeIndex - chỉ số của file đang được chọn trong danh sách file từ state.chat
export default function Header({ activeIndex }) {
  // Khởi tạo dispatch để gửi action lên Redux store
  const dispatch = useDispatch();
  // Lấy danh sách file từ state của chat trong Redux store
  const { files } = useSelector((state) => state.chat);

  // Hàm clearFilesHandler: Dispatch action clearFiles để xóa tất cả các file đã chọn
  const clearFilesHandler = () => {
    dispatch(clearFiles());
  };

  return (
    <div className="w-full">
      {/* Container Header */}
      <div className="w-full flex items-center justify-between">
        {/* Icon Close: khi nhấn vào icon này, gọi hàm clearFilesHandler để xóa file đính kèm */}
        <div
          className="translate-x-4 cursor-pointer"
          onClick={() => clearFilesHandler()}
        >
          <CloseIcon className="dark:fill-dark_svg_1" />
        </div>
        {/* Hiển thị tên file đang được chọn (nếu có) */}
        <h1 className="dark:text-dark_text_1 text-[15px]">
          {files[activeIndex]?.file?.name}
        </h1>
        {/* Thẻ rỗng để cân đối giao diện, có thể dùng cho các mục đích căn chỉnh */}
        <span></span>
      </div>
    </div>
  );
}
