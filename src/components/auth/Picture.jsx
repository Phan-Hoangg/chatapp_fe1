import { useRef, useState } from "react";

// Component Picture cho phép người dùng upload và xem ảnh đại diện.
// Nó nhận các props sau:
// - readablePicture: URL hoặc dữ liệu ảnh đã được chuyển đổi để hiển thị (dạng Data URL)
// - setReadablePicture: hàm setter để cập nhật readablePicture
// - setPicture: hàm setter để cập nhật file ảnh (File object)
export default function Picture({
  readablePicture,
  setReadablePicture,
  setPicture,
}) {
  // State để lưu trữ thông báo lỗi liên quan đến file ảnh
  const [error, setError] = useState("");

  // useRef được dùng để tham chiếu đến input file để có thể kích hoạt click một cách thủ công
  const inputRef = useRef();

  // Hàm xử lý khi người dùng chọn một file ảnh
  const handlePicture = (e) => {
    // Lấy file đầu tiên từ danh sách file người dùng chọn
    let pic = e.target.files[0];

    // Kiểm tra định dạng của file ảnh: chỉ chấp nhận JPEG, PNG và WEBP
    if (
      pic.type !== "image/jpeg" &&
      pic.type !== "image/png" &&
      pic.type !== "image/webp"
    ) {
      // Nếu định dạng không hợp lệ, cập nhật thông báo lỗi và dừng xử lý
      setError(`${pic.name} định dạng ảnh này không được hỗ trợ.`);
      return;
    } 
    // Kiểm tra kích thước của ảnh: giới hạn tối đa 5MB
    else if (pic.size > 1024 * 1024 * 5) {
      // Nếu kích thước quá lớn, cập nhật thông báo lỗi và dừng xử lý
      setError(`${pic.name} kích thước của ảnh quá lớn , tối đa 5mb.`);
      return;
    } 
    else {
      // Nếu file hợp lệ, xóa thông báo lỗi
      setError("");
      // Lưu file ảnh vào state bằng hàm setPicture (để có thể upload lên server, ví dụ)
      setPicture(pic);

      // Sử dụng FileReader để chuyển file ảnh sang dạng Data URL
      const reader = new FileReader();
      reader.readAsDataURL(pic);
      // Khi quá trình đọc file hoàn thành, cập nhật readablePicture để hiển thị ảnh
      reader.onload = (e) => {
        setReadablePicture(e.target.result);
      };
    }
  };

  // Hàm xử lý khi người dùng muốn thay đổi ảnh (xóa ảnh hiện tại và mở lại hộp thoại upload)
  const handleChangePic = () => {
    // Xóa ảnh hiện tại từ state
    setPicture("");
    setReadablePicture("");
    // Kích hoạt sự kiện click trên input file ẩn để mở hộp thoại chọn file
    inputRef.current.click();
  };

  return (
    <div className="mt-8 content-center dark:text-dark_text_1 space-y-1">
      {/* Label cho input ảnh */}
      <label htmlFor="picture" className="text-sm font-bold tracking-wide">
        Ảnh đại diện
      </label>
      
      {/* Nếu đã có ảnh để hiển thị (readablePicture tồn tại) */}
      {readablePicture ? (
        <div>
          {/* Hiển thị ảnh đã được upload */}
          <img
            src={readablePicture}
            alt="picture"
            className="w-20 h-20 object-cover rounded-full"
          />
          {/* Nút để xóa hoặc thay đổi ảnh */}
          <div
            className="mt-2 w-20 p-2 dark:bg-dark_bg_3 rounded-md text-sm flex items-center justify-center cursor-pointer"
            onClick={() => handleChangePic()}
          >
            Remove
          </div>
        </div>
      ) : (
        // Nếu chưa có ảnh, hiển thị nút "Upload picture"
        <div
          className="w-full h-12 dark:bg-dark_bg_3 rounded-md font-bold flex items-center justify-center cursor-pointer"
          onClick={() => inputRef.current.click()}
        >
          Upload picture
        </div>
      )}
      
      {/* Input file ẩn, được kích hoạt khi nhấn nút upload hoặc change */}
      <input
        type="file"
        name="picture"
        id="picture"
        hidden
        ref={inputRef}
        accept="image/png,image/jpeg,image/webp"
        onChange={handlePicture}
      />
      
      {/* Hiển thị thông báo lỗi nếu có */}
      <div className="mt-2">
        <p className="text-red-400">{error}</p>
      </div>
    </div>
  );
}
