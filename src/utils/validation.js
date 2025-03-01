import * as Yup from "yup";

export const signUpSchema = Yup.object({
  name: Yup.string()
    .required("Tên là bắt buộc.")
    .matches(
      /^[\p{L} _]*$/u,
      "Không được chứa ký tự đặc biệt, chỉ cho phép chữ cái và khoảng trắng."
    )
    .min(2, "Tên phải từ 2 đến 16 ký tự.")
    .max(16, "Tên phải từ 2 đến 16 ký tự."),

  email: Yup.string()
    .required("Email là bắt buộc.")
    .email("Email không hợp lệ."),

  status: Yup.string().max(64, "Trạng thái không được vượt quá 64 ký tự."),

  password: Yup.string()
    .required("Mật khẩu là bắt buộc.")
    .matches(
      /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
      "Mật khẩu phải có ít nhất 6 ký tự và chứa cả chữ cái lẫn số."
    ),
});
export const signInSchema = Yup.object({
  email: Yup.string().required("Email là bắt buộc.").email("Email hợp lệ."),
  password: Yup.string().required("Mật khẩu là bắt buộc."),
});
