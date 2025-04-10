export default function UnderlineInput({ name, setName }) {
  return (
    // Container với margin-top
    <div className="mt-4">
      {/* Ô input nhập liệu, kiểu text */}
      <input
        type="text"
        placeholder="Name" // Văn bản hiển thị khi input trống
        value={name} // Giá trị hiện tại của ô input được lấy từ prop "name"
        // Khi nội dung thay đổi, gọi hàm setName để cập nhật giá trị mới
        onChange={(e) => setName(e.target.value)}
        // ClassName tùy chỉnh giao diện:
        // - w-full: chiều rộng đầy đủ
        // - bg-transparent: nền trong suốt
        // - border-b: chỉ có đường viền dưới
        // - border-green_1: màu đường viền xanh lá (theo định nghĩa CSS)
        // - dark:text-dark_text_1: màu chữ cho chế độ tối
        // - outline-none: loại bỏ viền khi focus
        // - pl-1: padding bên trái 1 đơn vị
        className="w-full bg-transparent border-b border-green_1 dark:text-dark_text_1 outline-none pl-1"
      />
    </div>
  );
}
