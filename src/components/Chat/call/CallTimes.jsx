import { useEffect } from "react";

// Component CallTimes hiển thị thời gian cuộc gọi theo định dạng "HH:MM:SS"
// Props:
// - totalSecInCall: tổng số giây cuộc gọi đã diễn ra (state của component cha)
// - setTotalSecInCall: hàm cập nhật số giây cuộc gọi (để tăng dần theo thời gian)
// - callAccepted: boolean cho biết cuộc gọi đã được chấp nhận hay chưa
export default function CallTimes({
  totalSecInCall,
  setTotalSecInCall,
  callAccepted,
}) {
  useEffect(() => {
    // Hàm setSecInCall: tăng số giây cuộc gọi lên 1 đơn vị và đặt lại timeout 1 giây
    const setSecInCall = () => {
      setTotalSecInCall((prev) => prev + 1); // Tăng giá trị timer lên 1
      setTimeout(setSecInCall, 1000); // Gọi lại hàm sau 1 giây
    };

    // Nếu cuộc gọi đã được chấp nhận, bắt đầu đếm thời gian
    if (callAccepted) {
      setSecInCall();
    }

    // Cleanup: Khi component unmount hoặc callAccepted thay đổi, reset timer về 0
    return () => setTotalSecInCall(0);
  }, [callAccepted, setTotalSecInCall]);

  return (
    // Container hiển thị thời gian. Nếu totalSecInCall khác 0, hiển thị (block), ngược lại ẩn (hidden)
    <div
      className={`text-dark_text_2 ${
        totalSecInCall !== 0 ? "block" : "hidden"
      }`}
    >
      {/* Hiển thị giờ (HH) nếu có, luôn hiển thị định dạng 2 chữ số */}
      {parseInt(totalSecInCall / 3600).toString().length < 2 ? (
        <>
          <span>{"0" + parseInt(totalSecInCall / 3600)}</span>
          <span>:</span>
        </>
      ) : (
        <>
          <span>{parseInt(totalSecInCall / 3600)}</span>
          <span>:</span>
        </>
      )}
      {/* Hiển thị phút (MM) với định dạng 2 chữ số */}
      <span>
        {parseInt(totalSecInCall / 60).toString().length < 2
          ? "0" + parseInt(totalSecInCall / 60)
          : parseInt(totalSecInCall / 60)}
      </span>
      <span>:</span>
      {/* Hiển thị giây (SS) với định dạng 2 chữ số */}
      <span>
        {(totalSecInCall % 60).toString().length < 2
          ? "0" + (totalSecInCall % 60)
          : totalSecInCall % 60}
      </span>
    </div>
  );
}
