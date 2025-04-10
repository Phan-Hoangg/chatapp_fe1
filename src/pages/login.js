import LoginForm from "../components/auth/LoginForm";

// Component login hiển thị giao diện đăng nhập của ứng dụng
export default function login() {
  return (
    // Container chính có chiều cao bằng toàn bộ màn hình (h-screen)
    // Ứng dụng hỗ trợ dark mode (dark:bg-dark_bg_1)
    // Sử dụng flexbox để căn giữa nội dung theo chiều dọc và ngang
    // Padding trên (py-[19px]) và ẩn phần tràn (overflow-hidden)
    <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center py-[19px] overflow-hidden">
      {/* Container chứa form đăng nhập, với chiều rộng cố định, căn giữa theo chiều ngang (mx-auto) và chiều cao đầy đủ */}
      <div className="flex w-[1600px] mx-auto h-full">
        {/* Component LoginForm hiển thị form đăng nhập */}
        <LoginForm />
      </div>
    </div>
  );
}
