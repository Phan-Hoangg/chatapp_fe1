import { useState } from "react";
import CallAcions from "./CallAcions"; // Component hiển thị các hành động cuộc gọi (ví dụ: nút kết thúc cuộc gọi)
import CallArea from "./CallArea"; // Component hiển thị thông tin cuộc gọi (tên, thời gian, trạng thái cuộc gọi)
import Header from "./Header"; // Component header của cuộc gọi
import Ringing from "./Ringing"; // Component hiển thị giao diện "ringing" khi có cuộc gọi đến

// Component Call hiển thị giao diện cuộc gọi, bao gồm:
// - Các thông tin header, khu vực thông tin cuộc gọi (CallArea) và các hành động cuộc gọi (CallAcions)
// - Video streams của người dùng và người đối phương
// - Giao diện "ringing" nếu cuộc gọi đang đến mà chưa được chấp nhận
// - Phát ringtone khi chưa trả lời cuộc gọi
export default function Call({
  call, // Đối tượng chứa thông tin cuộc gọi (receiveingCall, callEnded, name, picture, signal, ...)
  setCall, // Hàm cập nhật trạng thái cuộc gọi
  callAccepted, // Boolean: cuộc gọi đã được chấp nhận hay chưa
  myVideo, // Ref đến phần tử video của chính người dùng (self video)
  stream, // Stream media của người dùng (video, audio)
  userVideo, // Ref đến phần tử video của người đối phương (remote video)
  answerCall, // Hàm xử lý khi trả lời cuộc gọi
  show, // Boolean: điều kiện hiển thị ringtone (đang gọi)
  endCall, // Hàm xử lý khi kết thúc cuộc gọi
  totalSecInCall, // Tổng số giây cuộc gọi đã diễn ra (được truyền xuống cho CallArea và CallTimes)
  setTotalSecInCall, // Hàm cập nhật tổng số giây cuộc gọi
}) {
  // Giải cấu trúc các thuộc tính cần thiết từ đối tượng call
  const { receiveingCall, callEnded, name, picture } = call;

  // State để quản lý hiển thị các hành động cuộc gọi khi di chuột qua khu vực cuộc gọi
  const [showActions, setShowActions] = useState(false);
  // State toggle dùng để chuyển đổi kích thước video (ví dụ: nhấp để phóng to/thu nhỏ)
  const [toggle, setToggle] = useState(false);

  return (
    <>
      {/* Container chính của giao diện cuộc gọi */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[550px] z-10 rounded-2xl overflow-hidden callbg
         ${receiveingCall && !callAccepted ? "hidden" : ""} 
         `}
        // Khi di chuột vào khu vực cuộc gọi, hiển thị các hành động (setShowActions = true)
        onMouseOver={() => setShowActions(true)}
        // Khi chuột rời khỏi khu vực, ẩn các hành động (setShowActions = false)
        onMouseOut={() => setShowActions(false)}
      >
        {/* Container chứa các thành phần của cuộc gọi */}
        <div>
          <div>
            {/* Header của cuộc gọi */}
            <Header />
            {/* CallArea hiển thị thông tin cuộc gọi như tên, thời gian, trạng thái cuộc gọi */}
            <CallArea
              name={name}
              totalSecInCall={totalSecInCall}
              setTotalSecInCall={setTotalSecInCall}
              callAccepted={callAccepted}
            />
            {/* CallAcions: hiển thị các nút hành động (ví dụ: kết thúc cuộc gọi)
                Chỉ hiển thị khi con trỏ chuột hover vào khu vực cuộc gọi */}
            {showActions ? <CallAcions endCall={endCall} /> : null}
          </div>
          {/* Phần hiển thị video streams */}
          <div>
            {/* Video của người đối phương (remote video) */}
            {callAccepted && !callEnded ? (
              <div>
                <video
                  ref={userVideo} // Ref để lấy stream video của người đối phương
                  playsInline // Cho phép phát video ngay trên trình duyệt
                  muted // Video của người đối phương được muted (để tránh phản hồi âm thanh trùng lặp)
                  autoPlay // Tự động phát video khi có stream
                  // Nếu toggle là true, sử dụng lớp SmallVideoCall, ngược lại sử dụng lớp largeVideoCall
                  className={toggle ? "SmallVideoCall" : "largeVideoCall"}
                  // Khi click vào video, chuyển đổi trạng thái toggle để thay đổi kích thước hiển thị video
                  onClick={() => setToggle((prev) => !prev)}
                ></video>
              </div>
            ) : null}
            {/* Video của chính người dùng (self video) */}
            {stream ? (
              <div>
                <video
                  ref={myVideo} // Ref để lấy stream video của chính người dùng
                  playsInline
                  muted // Self video luôn được muted để tránh echo
                  autoPlay
                  // Nếu toggle true, self video hiển thị với lớp largeVideoCall, ngược lại hiển thị với lớp SmallVideoCall
                  // Nếu showActions true, thêm lớp moveVideoCall để điều chỉnh vị trí khi hiển thị các hành động
                  className={`${toggle ? "largeVideoCall" : "SmallVideoCall"} ${
                    showActions ? "moveVideoCall" : ""
                  }`}
                  onClick={() => setToggle((prev) => !prev)}
                ></video>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {/* Giao diện "Ringing": hiển thị khi có cuộc gọi đến mà chưa được chấp nhận */}
      {receiveingCall && !callAccepted ? (
        <Ringing
          call={call}
          setCall={setCall}
          answerCall={answerCall}
          endCall={endCall}
        />
      ) : null}
      {/* Phát ringtone: hiển thị nếu cuộc gọi chưa được chấp nhận và điều kiện show = true */}
      {!callAccepted && show ? (
        <audio src="../../../../audio/ringing.mp3" autoPlay loop></audio>
      ) : null}
    </>
  );
}
