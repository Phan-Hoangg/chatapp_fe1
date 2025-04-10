import moment from "moment";
import "moment/locale/vi"; // Import ngôn ngữ tiếng Việt cho moment

// Hàm dateHandler xử lý định dạng và chuyển đổi ngày/thời gian
export const dateHandler = (date) => {
  // Lấy thời gian hiện tại với múi giờ GMT+7 (thường dùng cho Việt Nam)
  let now = moment().utcOffset(7);
  // Chuyển đổi ngày đầu vào sang đối tượng moment và thiết lập múi giờ GMT+7
  let momentDate = moment(date).utcOffset(7);
  // Tính khoảng thời gian từ momentDate đến hiện tại, trả về chuỗi ví dụ "5 phút" (không có từ "trước")
  let time = momentDate.fromNow(true);
  // Định dạng thời gian theo giờ và phút (theo định dạng 24h), ví dụ "14:30"
  let dateByHourAndMin = momentDate.format("HH:mm");

  // Hàm getDay được sử dụng để định dạng ngày dựa trên số ngày chênh lệch
  const getDay = () => {
    // Lấy số ngày từ chuỗi time (ví dụ: "5 ngày" -> "5")
    let days = time.split(" ")[0];
    // Nếu số ngày nhỏ hơn 8, trả về thứ trong tuần (ví dụ: "Thứ hai")
    if (Number(days) < 8) {
      // Sử dụng now.subtract để trừ đi số ngày và format thành thứ
      return now.subtract(Number(days), "days").format("dddd");
    } else {
      // Nếu chênh lệch nhiều hơn hoặc bằng 8 ngày, trả về định dạng "DD/MM/YYYY"
      return momentDate.format("DD/MM/YYYY");
    }
  };

  // Chuyển đổi chuỗi time từ tiếng Anh sang tiếng Việt theo một số quy tắc nhất định

  // Nếu time bằng "vài giây" (chỉ có vài giây trước), trả về "Bây giờ"
  if (time === "vài giây") {
    return "Bây giờ";
  }
  // Nếu time chứa "phút": 
  // - Lấy số phút từ chuỗi time, nếu bằng "một" thì trả về "1 phút", ngược lại trả về chuỗi số phút kèm "phút"
  if (time.includes("phút")) {
    let mins = time.split(" ")[0];
    return mins === "một" ? "1 phút" : `${mins} phút`;
  }
  // Nếu time chứa "giờ", trả về định dạng giờ và phút đã định nghĩa
  if (time.includes("giờ")) {
    return dateByHourAndMin;
  }
  // Nếu time bằng "một ngày", trả về "Hôm qua"
  if (time === "một ngày") {
    return "Hôm qua";
  }
  // Nếu time chứa "ngày", sử dụng hàm getDay để trả về thứ trong tuần hoặc định dạng ngày tháng năm
  if (time.includes("ngày")) {
    return getDay();
  }

  // Nếu không rơi vào các trường hợp trên, trả về chuỗi time ban đầu
  return time;
};
