import Contact from "./Contact"; // Import component Contact dùng để hiển thị thông tin của từng liên hệ

// Component SearchResults nhận vào các props:
// - searchResults: danh sách các kết quả tìm kiếm (mảng các đối tượng người dùng)
// - setSearchResults: hàm setter để cập nhật kết quả tìm kiếm (để có thể reset hoặc thay đổi khi cần)
export default function SearchResults({ searchResults, setSearchResults }) {
  return (
    // Container chính với chiều rộng đầy đủ và các class CSS định dạng danh sách cuộc hội thoại (convos) và thanh cuộn (scrollbar)
    <div className="w-full convos scrollbar">
      <div>
        {/* Heading của danh sách kết quả */}
        <div className="flex flex-col px-8 pt-8">
          {/* Tiêu đề "Contacts" hiển thị ở đầu danh sách */}
          <h1 className="font-extralight text-md text-green_2">Contacts</h1>
          {/* Vạch chân dưới dùng để phân cách heading với danh sách kết quả */}
          <span className="w-full mt-4 ml-10 border-b dark:border-b-dark_border_1"></span>
        </div>
        {/* Danh sách kết quả tìm kiếm */}
        <ul>
          {searchResults &&
            // Duyệt qua mảng searchResults, với mỗi đối tượng người dùng, render component Contact
            searchResults.map((user) => (
              <Contact
                contact={user} // Truyền thông tin người dùng vào prop "contact" của component Contact
                key={user._id} // Dùng _id của người dùng làm key duy nhất cho mỗi phần tử
                setSearchResults={setSearchResults} // Truyền hàm setSearchResults để cho phép component Contact có thể reset kết quả tìm kiếm nếu cần
              />
            ))}
        </ul>
      </div>
    </div>
  );
}
