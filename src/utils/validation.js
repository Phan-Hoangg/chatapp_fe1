import * as Yup from "yup";

// Schema xác thực đăng ký (signUpSchema)
export const signUpSchema = Yup.object({
  // Trường "name": bắt buộc, chỉ cho phép chữ cái và khoảng trắng, độ dài từ 2 đến 25 ký tự
  name: Yup.string()
    .required("Tên là bắt buộc.")
    // Sử dụng biểu thức chính quy để kiểm tra: chỉ cho phép chữ cái (Unicode letters) và khoảng trắng, dấu gạch dưới cũng được phép
    .matches(
      /^[\p{L} _]*$/u,
      "Không được chứa ký tự đặc biệt, chỉ cho phép chữ cái và khoảng trắng."
    )
    // Yêu cầu tên có tối thiểu 2 ký tự
    .min(2, "Tên phải từ 2 đến 25 ký tự.")
    // Yêu cầu tên tối đa 25 ký tự, thông báo bằng tiếng Anh
    .max(25, "Name must be between 2 and 25 characters."),

  // Trường "email": bắt buộc, định dạng email hợp lệ
  email: Yup.string()
    .required("Email là bắt buộc.")
    .email("Email không hợp lệ."),

  // Trường "status": không bắt buộc, nhưng nếu có thì không vượt quá 64 ký tự
  status: Yup.string().max(64, "Trạng thái không được vượt quá 64 ký tự."),

  // Trường "password": bắt buộc, phải có ít nhất 6 ký tự và chứa cả chữ cái lẫn số
  password: Yup.string()
    .required("Mật khẩu là bắt buộc.")
    // Biểu thức chính quy kiểm tra password:
    // - Ít nhất một chữ cái (a-z hoặc A-Z)
    // - Ít nhất một số (0-9)
    // - Độ dài tối thiểu 6 ký tự
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
      "Mật khẩu phải có ít nhất 6 ký tự và chứa cả chữ cái lẫn số."
    ),
});

// Schema xác thực đăng nhập (signInSchema)
export const signInSchema = Yup.object({
  // Trường "email": bắt buộc, định dạng email hợp lệ
  email: Yup.string()
    .required("Email là bắt buộc.")
    .email("Email hợp lệ."),
  // Trường "password": bắt buộc
  password: Yup.string().required("Mật khẩu là bắt buộc."),
});
