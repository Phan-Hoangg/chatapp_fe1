export default function Input({ message, setMessage }) {
  return (
    // Container ô nhập liệu với chiều rộng tối đa 60% và nền phù hợp chế độ dark
    <div className="w-full max-w-[60%] dark:bg-dark_hover_1 rounded-lg">
      {/* Ô input tin nhắn */}
      <input
        type="text" // Loại input là text
        placeholder="Type a message" // Văn bản placeholder hiển thị khi input trống
        value={message} // Giá trị của ô input được quản lý bởi state "message"
        // Khi giá trị ô input thay đổi, gọi hàm setMessage để cập nhật state
        onChange={(e) => setMessage(e.target.value)}
        // Các lớp CSS:
        // - w-full: chiếm chiều rộng đầy đủ của container
        // - bg-transparent: nền trong suốt để phù hợp với thiết kế
        // - h-11: chiều cao của ô input
        // - pl-2: padding bên trái, giúp nội dung không dính mép
        // - focus:outline-none: loại bỏ viền khi input được focus
        // - border-none: không có viền mặc định
        // - dark:text-dark_text_1: màu chữ phù hợp khi sử dụng chế độ dark
        className="w-full bg-transparent h-11 pl-2 focus:outline-none border-none dark:text-dark_text_1"
      />
    </div>
  );
}
