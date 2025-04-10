import { useForm } from "react-hook-form"; // Quản lý form và validation
import { yupResolver } from "@hookform/resolvers/yup"; // Tích hợp Yup vào react-hook-form
import { signUpSchema } from "../../utils/validation"; // Schema xác thực đăng ký, định nghĩa các quy tắc cho form
import AuthInput from "./Authinput"; // Component input tái sử dụng cho các trường form
import { useDispatch, useSelector } from "react-redux"; // Hook để truy cập Redux store và dispatch actions
import PulseLoader from "react-spinners/PulseLoader"; // Loader hiển thị khi đang xử lý (loading)
import { Link, useNavigate } from "react-router-dom"; // Hook điều hướng và liên kết từ react-router-dom
import { changeStatus, registerUser } from "../../features/userSlice"; // Action từ userSlice để đăng ký người dùng
import { useState } from "react"; // Hook quản lý state cục bộ của component
import Picture from "./Picture"; // Component xử lý upload và hiển thị ảnh
import axios from "axios"; // Thư viện gửi request HTTP

// Lấy các biến môi trường liên quan đến Cloudinary để upload ảnh
const cloud_name = process.env.REACT_APP_CLOUD_NAME;
const cloud_secret = process.env.REACT_APP_CLOUD_SECRET;

export default function RegisterForm() {
  const dispatch = useDispatch(); // Khởi tạo dispatch để gửi action Redux
  const navigate = useNavigate(); // Hook điều hướng sau khi đăng ký thành công
  const { status, error } = useSelector((state) => state.user); // Lấy trạng thái và lỗi từ Redux store (trạng thái của người dùng)

  // State để lưu file ảnh và dữ liệu hiển thị của ảnh (dạng Data URL)
  const [picture, setPicture] = useState();
  const [readablePicture, setReadablePicture] = useState("");

  // Sử dụng useForm với yupResolver để thực hiện xác thực form theo signUpSchema
  const {
    register, // Hàm đăng ký các input (dùng cho React Hook Form)
    handleSubmit, // Hàm xử lý submit form
    watch, // Theo dõi giá trị của các trường trong form (nếu cần)
    formState: { errors }, // Lấy thông tin lỗi từ quá trình xác thực của form
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  // Hàm xử lý submit form
  const onSubmit = async (data) => {
    // Cập nhật trạng thái đăng ký thành "loading" trong Redux store
    dispatch(changeStatus("loading"));

    // Nếu có file ảnh được chọn, upload ảnh lên Cloudinary trước khi đăng ký người dùng
    if (picture) {
      // Gọi hàm uploadImage và sau khi upload thành công, dispatch action registerUser với URL của ảnh
      await uploadImage().then(async (response) => {
        let res = await dispatch(
          registerUser({ ...data, picture: response.secure_url })
        );
        // Nếu đăng ký thành công (payload chứa thông tin user), chuyển hướng về trang chủ
        if (res?.payload?.user) {
          navigate("/");
        }
      });
    } else {
      // Nếu không có ảnh, dispatch action registerUser với picture rỗng
      let res = await dispatch(registerUser({ ...data, picture: "" }));
      if (res?.payload?.user) {
        navigate("/");
      }
    }
  };

  // Hàm uploadImage gửi file ảnh lên Cloudinary
  const uploadImage = async () => {
    let formData = new FormData();
    // "upload_preset" được sử dụng để cấu hình Cloudinary, ở đây dùng cloud_secret (có thể đặt tên khác trong cấu hình Cloudinary)
    formData.append("upload_preset", cloud_secret);
    // Thêm file ảnh vào formData
    formData.append("file", picture);
    // Gửi POST request đến endpoint của Cloudinary để upload ảnh
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
      formData
    );
    return data; // Trả về dữ liệu từ Cloudinary (bao gồm secure_url)
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 dark:bg-dark_bg_1">
      {/* Container của form */}
      <div className="w-full max-w-md space-y-6 p-10 bg-white dark:bg-dark_bg_2 shadow-lg rounded-xl">
        {/* Heading */}
        <div className="text-center dark:text-dark_text_1">
          <h2 className="text-3xl font-bold">Welcome</h2>
          <p className="mt-2 text-sm">Đăng ký</p>
        </div>

        {/* Form đăng ký */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Trường tên */}
          <AuthInput
            name="name"
            type="text"
            placeholder="Họ và tên"
            register={register}
            error={errors?.name?.message}
          />
          {/* Trường email */}
          <AuthInput
            name="email"
            type="text"
            placeholder="Địa chỉ email"
            register={register}
            error={errors?.email?.message}
          />
          {/* Trường trạng thái */}
          <AuthInput
            name="status"
            type="text"
            placeholder="Trạng thái"
            register={register}
            error={errors?.status?.message}
          />
          {/* Trường mật khẩu */}
          <AuthInput
            name="password"
            type="password"
            placeholder="Mật khẩu"
            register={register}
            error={errors?.password?.message}
          />
          {/* Component xử lý upload và hiển thị ảnh */}
          <Picture
            readablePicture={readablePicture}
            setReadablePicture={setReadablePicture}
            setPicture={setPicture}
          />
          {/* Hiển thị lỗi từ Redux (nếu có) */}
          {error ? (
            <div>
              <p className="text-red-400">{error}</p>
            </div>
          ) : null}
          {/* Nút submit của form */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            {status == "loading" ? (
              // Nếu đang loading, hiển thị loader
              <PulseLoader color="#fff" size={16} />
            ) : (
              "Đăng ký"
            )}
          </button>
          {/* Liên kết chuyển hướng đến trang đăng nhập nếu đã có tài khoản */}
          <p className="flex flex-col items-center justify-center mt-10 text-center text-md dark:text-dark_text_1">
            <span>Bạn đã có tài khoản ?</span>
            <Link
              to="/login"
              className="hover:underline cursor-pointer transition ease-in duration-300"
            >
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
