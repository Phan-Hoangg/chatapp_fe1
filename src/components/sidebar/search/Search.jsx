import axios from "axios"; // Import axios để thực hiện các request HTTP
import { useState } from "react"; // Import hook useState của React để quản lý state cục bộ
import { useSelector } from "react-redux"; // Import hook useSelector để truy cập dữ liệu từ Redux store
import { FilterIcon, ReturnIcon, SearchIcon } from "../../../svg"; // Import các icon được sử dụng trong component

// Component Search dùng để tìm kiếm người dùng và khởi tạo cuộc trò chuyện mới
// Props nhận vào:
// - searchLength: độ dài của giá trị tìm kiếm hiện tại (để điều chỉnh hiển thị icon)
// - setSearchResults: hàm setter để cập nhật kết quả tìm kiếm
export default function Search({ searchLength, setSearchResults }) {
  // Lấy thông tin người dùng từ Redux store
  const { user } = useSelector((state) => state.user);
  // Lấy token của người dùng từ thông tin user (dùng để gửi yêu cầu xác thực tới API)
  const { token } = user;

  // State "show" dùng để điều khiển hiển thị của icon (mặc định false)
  const [show, setShow] = useState(false);

  // Hàm xử lý tìm kiếm khi người dùng nhấn phím Enter
  const handleSearch = async (e) => {
    // Kiểm tra nếu ô input có giá trị và phím được nhấn là "Enter"
    if (e.target.value && e.key === "Enter") {
      try {
        // Gửi request GET đến API để tìm kiếm người dùng theo từ khóa
        // URL được xây dựng từ biến môi trường REACT_APP_API_ENDPOINT
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_ENDPOINT}/user?search=${e.target.value}`,
          {
            headers: {
              // Gửi token trong header để xác thực
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // Cập nhật kết quả tìm kiếm vào state thông qua hàm setSearchResults
        setSearchResults(data);
      } catch (error) {
        // Nếu có lỗi xảy ra, log thông báo lỗi ra console
        console.log(error.response.data.error.message);
      }
    } else {
      // Nếu không có giá trị nhập hoặc không nhấn Enter, reset kết quả tìm kiếm
      setSearchResults([]);
    }
  };

  return (
    <div className="h-[49px] py-1.5">
      {/* Container bên ngoài */}
      <div className="px-[10px]">
        {/* Container cho input tìm kiếm và các icon */}
        <div className="flex items-center gap-x-2">
          <div className="w-full flex dark:bg-dark_bg_2 rounded-lg pl-2">
            {/* Hiển thị icon: nếu state "show" hoặc searchLength > 0 thì hiển thị icon Return, ngược lại hiển thị icon Search */}
            {show || searchLength > 0 ? (
              <span
                className="w-8 flex items-center justify-center rotateAnimation cursor-pointer"
                // Khi click vào icon Return, reset kết quả tìm kiếm
                onClick={() => setSearchResults([])}
              >
                <ReturnIcon className="fill-green_1 w-5" />
              </span>
            ) : (
              <span className="w-8 flex items-center justify-center">
                <SearchIcon className="dark:fill-dark_svg_2 w-5" />
              </span>
            )}
            {/* Ô input tìm kiếm */}
            <input
              type="text"
              placeholder="Search or start a new chat" // Placeholder hiển thị khi input trống
              className="input"
              // Khi input được focus, set state "show" thành true (để hiển thị icon Return)
              onFocus={() => setShow(true)}
              // Khi mất focus, nếu không có giá trị tìm kiếm (searchLength === 0) thì set "show" thành false
              onBlur={() => searchLength === 0 && setShow(false)}
              // Lắng nghe sự kiện bàn phím, gọi hàm handleSearch khi có sự kiện keydown
              onKeyDown={(e) => handleSearch(e)}
            />
          </div>
          {/* Nút Filter, hiển thị icon Filter */}
          <button className="btn">
            <FilterIcon className="dark:fill-dark_svg_2" />
          </button>
        </div>
      </div>
    </div>
  );
}
