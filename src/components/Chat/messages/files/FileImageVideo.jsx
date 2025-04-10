export default function FileImageVideo({ url, type }) {
  return (
    // Container chứa file, có z-index cao để hiển thị trên các phần tử khác
    <div className="z-20">
      {type === "IMAGE" ? (
        // Nếu type là "IMAGE", hiển thị thẻ <img> với thuộc tính src lấy từ url
        <img src={url} alt="" className="cursor-pointer" />
      ) : (
        // Nếu type khác "IMAGE" (ví dụ: "VIDEO"), hiển thị thẻ <video> với src lấy từ url,
        // thuộc tính controls để hiển thị các điều khiển như play/pause, và class "cursor-pointer"
        <video src={url} controls className="cursor-pointer"></video>
      )}
    </div>
  );
}
