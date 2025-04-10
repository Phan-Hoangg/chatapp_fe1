export const getFileType = (memType) => {
  // Dựa vào MIME type của file (memType), hàm sẽ trả về định dạng file dưới dạng chuỗi
  switch (memType) {
    // Nếu MIME type là "text/plain", trả về "TXT"
    case "text/plain":
      return "TXT";
    // Nếu MIME type là "application/pdf", trả về "PDF"
    case "application/pdf":
      return "PDF";
    // Nếu MIME type là "application/msword" hoặc "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    // Trả về "DOCX" (định dạng tài liệu Word)
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "DOCX";
    // Nếu MIME type là "application/vnd.ms-powerpoint" hoặc "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    // Trả về "PPTX" (định dạng bài thuyết trình PowerPoint)
    case "application/vnd.ms-powerpoint":
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return "PPTX";
    // Nếu MIME type là "application/vnd.ms-excel" hoặc "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    // Trả về "XLSX" (định dạng bảng tính Excel)
    case "application/vnd.ms-excel":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return "XLSX ";
    // Nếu MIME type là "application/vnd.rar", trả về "RAR"
    case "application/vnd.rar":
      return "RAR";
    // Nếu MIME type là "application/zip", trả về "ZIP"
    case "application/zip":
      return "ZIP";
    // Nếu MIME type là "audio/mpeg" hoặc "audio/wav", trả về "AUDIO" (định dạng file âm thanh)
    case "audio/mpeg":
    case "audio/wav":
      return "AUDIO";
    // Nếu MIME type là "video/mp4" hoặc "video/mpeg", trả về "VIDEO" (định dạng file video)
    case "video/mp4":
    case "video/mpeg":
      return "VIDEO";
    // Nếu không rơi vào các trường hợp trên, mặc định trả về "IMAGE"
    default:
      return "IMAGE";
  }
};
