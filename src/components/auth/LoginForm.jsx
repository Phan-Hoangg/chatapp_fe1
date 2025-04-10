// Import hook từ react-hook-form để quản lý form
import { useForm } from "react-hook-form";
// Import yupResolver để tích hợp Yup với react-hook-form
import { yupResolver } from "@hookform/resolvers/yup";
// Import schema xác thực từ utils/validation (được định nghĩa bằng Yup)
import { signInSchema } from "../../utils/validation";
// Import component AuthInput để render các input của form
import AuthInput from "./Authinput";
// Import hook Redux để dispatch action và truy cập state từ store
import { useDispatch, useSelector } from "react-redux";
// Import loader component hiển thị khi trạng thái loading
import PulseLoader from "react-spinners/PulseLoader";
// Import Link và useNavigate từ react-router-dom để điều hướng và tạo liên kết
import { Link, useNavigate } from "react-router-dom";
// Import action loginUser từ userSlice để thực hiện đăng nhập
import { loginUser } from "../../features/userSlice";

export default function RegisterForm() {
  // Khởi tạo dispatch để gửi action Redux
  const dispatch = useDispatch();
  // useNavigate để chuyển hướng sau khi đăng nhập thành công
  const navigate = useNavigate();

  // Truy cập trạng thái user từ Redux store (chứa status và error của quá trình đăng nhập)
  const { status, error } = useSelector((state) => state.user);

  // Sử dụng useForm để quản lý form
  // Cấu hình resolver sử dụng yupResolver với schema signInSchema để thực hiện xác thực
  const {
    register, // Hàm đăng ký input, tích hợp với React Hook Form
    handleSubmit, // Hàm xử lý submit của form
    formState: { errors }, // Lấy thông tin lỗi xác thực của từng trường input
  } = useForm({
    resolver: yupResolver(signInSchema),
  });

  // Hàm xử lý submit của form khi form hợp lệ
  const onSubmit = async (values) => {
    // Dispatch action loginUser với các giá trị của form (values)
    let res = await dispatch(loginUser({ ...values }));
    console.log(res);
    // Nếu đăng nhập thành công (payload chứa thông tin user) thì chuyển hướng về trang chủ
    if (res?.payload?.user) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-hidden">
      {/* Container của form */}
      <div className="w-full max-w-md space-y-8 p-10 dark:bg-dark_bg_2 rounded-xl">
        {/* Heading của form */}
        <div className="text-center dark:text-dark_text_1">
          <h2 className="mt-6 text-3xl font-bold">Welcome Back</h2>
          <p className="mt-2 text-sm">Đăng nhập</p>
        </div>
        {/* Form bắt đầu */}
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
          {/* Input email */}
          <AuthInput
            name="email"
            type="text"
            placeholder="Địa chỉ Email"
            register={register}
            error={errors?.email?.message} // Hiển thị thông báo lỗi nếu có
          />
          {/* Input mật khẩu */}
          <AuthInput
            name="password"
            type="password"
            placeholder="Mật Khẩu"
            register={register}
            error={errors?.password?.message}
          />

          {/* Nếu có lỗi đăng nhập từ Redux state (ví dụ: sai thông tin xác thực) */}
          {error ? (
            <div>
              <p className="text-red-400">{error}</p>
            </div>
          ) : null}

          {/* Nút submit của form */}
          <button
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            type="submit"
          >
            {status === "loading" ? (
              // Nếu đang loading, hiển thị loader
              <PulseLoader color="#fff" size={16} />
            ) : (
              "Đăng nhập"
            )}
          </button>

          {/* Liên kết chuyển hướng nếu người dùng chưa có tài khoản */}
          <p className="flex flex-col items-center justify-center mt-10 text-center text-md dark:text-dark_text_1">
            <span>Bạn chưa có tài khoản ?</span>
            <Link
              to="/register"
              className="hover:underline cursor-pointer transition ease-in duration-300"
            >
              Đăng ký
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
