import RegisterForm from "../components/auth/RegisterForm";

// Component register chịu trách nhiệm hiển thị giao diện đăng ký người dùng cho ứng dụng.
export default function register() {
  return (
    // Container chính có chiều cao tối thiểu bằng toàn bộ màn hình (min-h-screen)
    // Áp dụng nền cho chế độ dark (dark:bg-dark_bg_1)
    // Sử dụng flexbox để căn giữa nội dung theo chiều dọc và ngang (items-center, justify-center)
    // Thêm padding trên và dưới (py-[19px]) và ẩn các phần tràn ra ngoài (overflow-hidden)
    <div className="min-h-screen dark:bg-dark_bg_1 flex items-center justify-center py-[19px] overflow-hidden">
      {/* Container chứa form đăng ký, có chiều rộng cố định (w-[1600px]), căn giữa theo chiều ngang (mx-auto) và chiếm chiều cao đầy đủ (h-full) */}
      <div className="flex w-[1600px] mx-auto h-full">
        {/* Component RegisterForm hiển thị giao diện đăng ký */}
        <RegisterForm />
      </div>
    </div>
  );
}
