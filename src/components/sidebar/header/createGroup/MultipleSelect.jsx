// Import component Select từ thư viện react-select để hiển thị dropdown chọn nhiều giá trị
import Select from "react-select";

// Component MultipleSelect hiển thị ô chọn đa giá trị cho phép tìm kiếm và chọn người dùng
// Các props nhận vào bao gồm:
// - selectedUsers: danh sách người dùng đã được chọn (state của component cha)
// - setSelectedUsers: hàm setter cập nhật danh sách người dùng được chọn
// - searchResults: danh sách kết quả tìm kiếm người dùng (dữ liệu từ API)
// - handleSearch: hàm xử lý sự kiện khi người dùng nhập từ khóa tìm kiếm
export default function MultipleSelect({
  selectedUsers,
  setSelectedUsers,
  searchResults,
  handleSearch,
}) {
  return (
    <div className="mt-4">
      <Select
        // options: danh sách các tùy chọn hiển thị được lấy từ searchResults
        options={searchResults}
        // onChange: khi người dùng chọn hoặc bỏ chọn, cập nhật danh sách người dùng được chọn
        onChange={setSelectedUsers}
        // onKeyDown: lắng nghe sự kiện bàn phím để kích hoạt handleSearch (ví dụ: khi nhấn Enter)
        onKeyDown={(e) => handleSearch(e)}
        // Placeholder hiển thị khi không có lựa chọn nào được chọn
        placeholder="Search, select users"
        // isMulti: cho phép chọn nhiều giá trị
        isMulti
        // formatOptionLabel: định dạng cách hiển thị mỗi tùy chọn trong dropdown
        // Ở đây, mỗi tùy chọn hiển thị hình ảnh đại diện và tên của người dùng
        formatOptionLabel={(user) => (
          <div className="flex items-center gap-1">
            <img
              src={user.picture}
              alt=""
              className="w-8 h-8 object-cover rounded-full"
            />
            <span className="text-[#222]">{user.label}</span>
          </div>
        )}
        // styles: tùy chỉnh style cho component Select
        // Ở đây, style cho phần control được sửa đổi để loại bỏ viền và nền mặc định
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            border: "none",
            borderColor: "transparent",
            background: "transparent",
          }),
        }}
      />
    </div>
  );
}
