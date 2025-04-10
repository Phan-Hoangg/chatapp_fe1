// Đây là một functional component của React, được sử dụng để render một input field cho mục đích xác thực (auth).
// Các props nhận vào bao gồm:
// - name: Tên của trường (dùng cho thuộc tính htmlFor của label và spread vào input)
// - type: Loại input (ví dụ: "text", "password", v.v.)
// - placeholder: Văn bản hiển thị khi input trống, cũng được dùng làm label cho input
// - register: Hàm đăng ký input (ví dụ từ React Hook Form) để quản lý dữ liệu form
// - error: Thông báo lỗi nếu có, để hiển thị lỗi xác thực cho người dùng
export default function AuthInput({
  name,
  type,
  placeholder,
  register,
  error,
}) {
  return (
    // Container chứa label, input và thông báo lỗi
    <div className="mt-8 content-center dark:text-dark_text_1 space-y-1">
      {/* Label hiển thị placeholder, sử dụng htmlFor liên kết với input qua prop name */}
      <label htmlFor={name} className="text-sm font-bold tracking-wide">
        {placeholder}
      </label>
      {/* Input field, sử dụng các thuộc tính:
          - type: Loại input (ví dụ: text, password)
          - placeholder: Văn bản hiển thị khi không có giá trị
          - {...register(name)}: Đăng ký input với React Hook Form để quản lý state của form */}
      <input
        className="w-full dark:bg-dark_bg_3 text-base py-2 px-4 rounded-lg outline-none"
        type={type}
        placeholder={placeholder}
        {...register(name)}
      />
      {/* Nếu có lỗi, hiển thị thông báo lỗi với màu đỏ */}
      {error && <p className="text-red-400">{error}</p>}
    </div>
  );
}
