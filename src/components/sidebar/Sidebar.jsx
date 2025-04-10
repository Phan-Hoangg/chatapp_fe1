import { useState } from "react";
import { Conversations } from "./conversations"; // Import component hiển thị danh sách cuộc hội thoại
import { SidebarHeader } from "./header"; // Import component hiển thị header của sidebar
import { Notifications } from "./notifications"; // Import component hiển thị thông báo (notifications)
import { Search } from "./search"; // Import component Search cho việc tìm kiếm
import { SearchResults } from "./search"; // Import component hiển thị kết quả tìm kiếm

// Component Sidebar hiển thị sidebar chính của ứng dụng chat
// Sidebar bao gồm Header, Notifications, ô tìm kiếm và danh sách cuộc hội thoại hoặc kết quả tìm kiếm
export default function Sidebar({ onlineUsers, typing }) {
  // State searchResults lưu trữ danh sách kết quả tìm kiếm người dùng
  const [searchResults, setSearchResults] = useState([]);

  return (
    // Container chính của Sidebar, giới hạn chiều rộng tối đa 30% và chiều cao đầy đủ
    // "select-none" ngăn không cho người dùng chọn văn bản trên sidebar
    <div className="flex0030 max-w-[30%] h-full select-none">
      {/* Sidebar Header: hiển thị thông tin người dùng, avatar, và các icon chức năng */}
      <SidebarHeader />

      {/* Notifications: hiển thị các thông báo của người dùng */}
      <Notifications />

      {/* Search: ô tìm kiếm, truyền vào độ dài kết quả tìm kiếm hiện tại và hàm cập nhật kết quả */}
      <Search
        searchLength={searchResults.length}
        setSearchResults={setSearchResults}
      />

      {/* Nếu có kết quả tìm kiếm (searchResults.length > 0) thì hiển thị SearchResults */}
      {searchResults.length > 0 ? (
        <>
          {/* SearchResults: hiển thị danh sách các liên hệ được tìm thấy */}
          <SearchResults
            searchResults={searchResults}
            setSearchResults={setSearchResults}
          />
        </>
      ) : (
        <>
          {/* Nếu không có kết quả tìm kiếm, hiển thị danh sách cuộc hội thoại */}
          <Conversations onlineUsers={onlineUsers} typing={typing} />
        </>
      )}
    </div>
  );
}
