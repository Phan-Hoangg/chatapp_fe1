import moment from "moment";
import "moment/locale/vi"; // Thêm hỗ trợ tiếng Việt

export const dateHandler = (date) => {
  let now = moment().utcOffset(7); // Chỉnh múi giờ sang GMT+7
  let momentDate = moment(date).utcOffset(7); // Chỉnh múi giờ cho ngày đầu vào
  let time = momentDate.fromNow(true); // Thời gian trước đó (ví dụ: "5 phút trước" -> "5 phút")
  let dateByHourAndMin = momentDate.format("HH:mm"); // Định dạng giờ phút (24h)

  const getDay = () => {
    let days = time.split(" ")[0]; // Lấy số ngày
    if (Number(days) < 8) {
      return now.subtract(Number(days), "days").format("dddd"); // Hiển thị thứ trong tuần
    } else {
      return momentDate.format("DD/MM/YYYY"); // Hiển thị ngày/tháng/năm
    }
  };

  // Chuyển đổi thông tin từ tiếng Anh sang tiếng Việt
  if (time === "vài giây") {
    return "Bây giờ"; // Nếu là vài giây -> "Bây giờ"
  }
  if (time.includes("phút")) {
    let mins = time.split(" ")[0];
    return mins === "một" ? "1 phút" : `${mins} phút`;
  }
  if (time.includes("giờ")) {
    return dateByHourAndMin;
  }
  if (time === "một ngày") {
    return "Hôm qua";
  }
  if (time.includes("ngày")) {
    return getDay();
  }

  return time;
};
