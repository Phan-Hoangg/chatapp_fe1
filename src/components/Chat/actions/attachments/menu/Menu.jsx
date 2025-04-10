// Import component DocumentAttachment xử lý file tài liệu
import DocumentAttachment from "./DocumentAttachment";
// Import component PhotoAttachment xử lý file ảnh
import PhotoAttachment from "./PhotoAttachment";

// Component Menu dùng để hiển thị menu các tùy chọn đính kèm (attachment)
// trong giao diện chat hoặc form, ví dụ: đính kèm tài liệu hoặc ảnh.
export default function Menu() {
  return (
    // Render một danh sách không thứ tự (ul) được định vị tuyệt đối
    // với lớp "absolute bottom-14 openEmojiAnimation" nhằm đưa menu lên vị trí phù hợp
    // và áp dụng hiệu ứng animation (ví dụ: mở menu)
    <ul className="absolute bottom-14 openEmojiAnimation">
      {/* Component cho tùy chọn đính kèm tài liệu */}
      <DocumentAttachment />
      {/* Component cho tùy chọn đính kèm ảnh */}
      <PhotoAttachment />
    </ul>
  );
}
