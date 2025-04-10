import { capitalize } from "../../../utils/string"; // Import hàm viết hoa chữ cái đầu tiên của chuỗi
import CallTimes from "./CallTimes"; // Import component hiển thị thời gian cuộc gọi

// Component CallArea hiển thị thông tin cuộc gọi, bao gồm tên người gọi, trạng thái "Ringing..." và thời gian cuộc gọi
// Các props nhận vào:
// - name: tên của người gọi (hoặc nhóm)
// - totalSecInCall: tổng số giây cuộc gọi đã diễn ra
// - setTotalSecInCall: hàm cập nhật tổng số giây cuộc gọi (dùng trong CallTimes)
// - callAccepted: boolean cho biết cuộc gọi đã được chấp nhận hay chưa
export default function CallArea({
  name,
  totalSecInCall,
  setTotalSecInCall,
  callAccepted,
}) {
  return (
    // Container ngoài được định vị tuyệt đối cách từ trên 12 đơn vị, có z-index cao để hiển thị trên cùng
    <div className="absolute top-12 z-40 w-full p-1">
      {/* Container chính chứa thông tin cuộc gọi, căn giữa theo chiều ngang */}
      <div className="flex flex-col items-center">
        {/* Phần hiển thị thông tin cuộc gọi (tên và trạng thái) */}
        <div className="flex flex-col items-center gap-y-1">
          {/* Hiển thị tên của người gọi (được viết hoa chữ cái đầu tiên nếu có giá trị) */}
          <h1 className="text-white text-lg">
            <b>{name ? capitalize(name) : ""}</b>
          </h1>
          {/* Nếu totalSecInCall bằng 0, hiển thị trạng thái "Ringing..." */}
          {totalSecInCall === 0 ? (
            <span className="text-dark_text_1">Ringing...</span>
          ) : null}
          {/* Component CallTimes hiển thị thời gian cuộc gọi theo định dạng HH:MM:SS */}
          <CallTimes
            totalSecInCall={totalSecInCall}
            setTotalSecInCall={setTotalSecInCall}
            callAccepted={callAccepted}
          />
        </div>
      </div>
    </div>
  );
}
