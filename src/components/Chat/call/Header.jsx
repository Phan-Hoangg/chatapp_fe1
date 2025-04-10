import { AddContactIcon, ArrowIcon, LockIcon } from "../../../svg";

// Component Header hiển thị phần đầu của giao diện cuộc gọi (hoặc chat)
// Bao gồm: nút quay lại, thông báo "Được mã hóa đầu cuối" và nút thêm liên hệ
export default function Header() {
  return (
    // Header được định vị tuyệt đối ở đầu trang với chiều rộng toàn bộ và z-index cao để hiển thị trên các phần tử khác
    <header className="absolute top-0 w-full z-40">
      {/* Container của header với padding và căn giữa theo chiều dọc, chia đều các phần tử */}
      <div className="p-1 flex items-center justify-between">
        {/* Nút quay lại: khi nhấn, có thể xử lý quay lại trang trước (hiện tại không có hàm onClick) */}
        <button className="btn">
          <span className="rotate-180 scale-150">
            {/* Icon mũi tên được xoay 180 độ để biểu thị nút "trở về" */}
            <ArrowIcon className="fill-white" />
          </span>
        </button>
        {/* Hiển thị thông báo "Được mã hóa đầu cuối" kèm theo icon ổ khóa */}
        <p className="flex items-center">
          {/* Icon ổ khóa nhỏ để biểu thị tính bảo mật */}
          <LockIcon className="fill-white scale-75" />
          {/* Văn bản hiển thị thông báo, sử dụng font chữ nhỏ */}
          <span className="text-xs text-white">Được mã hóa đầu cuối</span>
        </p>
        {/* Nút thêm liên hệ: có thể dùng để thêm người mới vào cuộc gọi hoặc chat */}
        <button className="btn">
          <AddContactIcon className="fill-white" />
        </button>
      </div>
    </header>
  );
}
