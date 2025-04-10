// Hàm capitalize nhận vào một chuỗi (word) và trả về chuỗi đó với chữ cái đầu tiên được viết hoa
// và các chữ cái còn lại được chuyển về chữ thường
export const capitalize = (word) => {
  // word[0].toUpperCase() lấy chữ cái đầu tiên của chuỗi và chuyển thành chữ hoa
  // word.substring(1).toLowerCase() lấy phần còn lại của chuỗi (từ vị trí 1 trở đi) và chuyển thành chữ thường
  return word[0].toUpperCase() + word.substring(1).toLowerCase();
};
