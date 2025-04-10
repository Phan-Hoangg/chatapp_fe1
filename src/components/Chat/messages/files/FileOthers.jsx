import DownloadIcon from "../../../../svg/Download";

// Component FileOthers hiển thị thông tin file không phải ảnh hoặc video (ví dụ: tài liệu, file nén, v.v.)
export default function FileOthers({ file, type, me }) {
  // Hàm formatFileSize chuyển đổi kích thước file (tính bằng bytes) sang định dạng dễ đọc (B, KB, MB, GB)
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`; // Nếu kích thước nhỏ hơn 1024 bytes, hiển thị đơn vị B
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`; // Nếu nhỏ hơn 1MB, chuyển đổi sang KB
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`; // Nếu nhỏ hơn 1GB, chuyển đổi sang MB
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`; // Nếu lớn hơn hoặc bằng 1GB, chuyển đổi sang GB
  };

  return (
    // Container của file, sử dụng background xanh nhạt (bg-green_4), padding và bo tròn các góc
    <div className="bg-green_4 p-2 rounded-lg">
      {/* Container chứa thông tin file và nút download, được căn giữa và cách nhau một khoảng */}
      <div className="flex justify-between gap-x-8">
        {/* Phần hiển thị thông tin file */}
        <div className="flex items-center gap-2">
          {/* Hiển thị icon đại diện của file dựa trên type */}
          <img
            // Đường dẫn đến icon file dựa trên type, ví dụ: "PDF.png", "DOCX.png"
            src={`../../../../images/file/${type}.png`}
            alt=""
            className="w-8 object-contain"
          />
          {/* Container chứa tên file và thông tin kích thước */}
          <div className="flex flex-col gap-2">
            {/* Hiển thị tên file kết hợp với phần mở rộng của file */}
            <h1>
              {file.original_filename}.{file.public_id.split(".")[1]}
            </h1>
            {/* Hiển thị thông tin về type của file và kích thước đã được định dạng */}
            <span className="text-sm">
              {type} • {formatFileSize(file.bytes)}
            </span>
          </div>
        </div>
        {/* Nút download: chỉ hiển thị nếu tin nhắn không do chính user gửi (me == false) */}
        {!me && (
          <a href={file.secure_url} target="_blank" download>
            <DownloadIcon />
          </a>
        )}
      </div>
    </div>
  );
}
