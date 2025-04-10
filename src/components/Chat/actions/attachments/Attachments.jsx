// Import biểu tượng AttachmentIcon từ thư mục svg
import { AttachmentIcon } from "../../../../svg";
// Import component Menu, chứa danh sách các tùy chọn đính kèm (attachments)
import Menu from "./menu/Menu";

// Component Attachments được dùng để hiển thị nút đính kèm và menu các tùy chọn đính kèm
// Các props nhận vào bao gồm:
// - showAttachments: boolean xác định xem menu đính kèm có hiển thị hay không
// - setShowAttachments: hàm setter để thay đổi trạng thái showAttachments
// - setShowPicker: hàm setter để điều chỉnh hiển thị của bộ chọn emoji (hoặc các picker khác)
export default function Attachments({
  showAttachments,
  setShowAttachments,
  setShowPicker,
}) {
  return (
    // Bao bọc bên trong phần tử <li> với vị trí relative để định vị các thành phần con (ví dụ: Menu)
    <li className="relative">
      {/* Nút bấm hiển thị biểu tượng AttachmentIcon */}
      <button
        // Khi click vào nút, thực hiện các thao tác:
        // 1. setShowPicker(false): Ẩn bộ chọn (picker) hiện tại (ví dụ: emoji picker)
        // 2. setShowAttachments((prev) => !prev): Đảo ngược trạng thái showAttachments để hiển thị hoặc ẩn menu đính kèm
        onClick={() => {
          setShowPicker(false);
          setShowAttachments((prev) => !prev);
        }}
        type="button"
        className="btn"
      >
        {/* Hiển thị biểu tượng đính kèm, với style tùy chỉnh cho chế độ tối (dark) */}
        <AttachmentIcon className="dark:fill-dark_svg_1" />
      </button>
      {/* Nếu showAttachments bằng true, render component Menu chứa các tùy chọn đính kèm,
          nếu không thì không render gì (null) */}
      {showAttachments ? <Menu /> : null}
    </li>
  );
}
