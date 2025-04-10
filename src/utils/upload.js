import axios from "axios";

// Lấy thông tin Cloudinary từ biến môi trường
const cloud_name = process.env.REACT_APP_CLOUD_NAME;
const cloud_secret = process.env.REACT_APP_CLOUD_SECRET;

/**
 * Hàm uploadFiles nhận vào một mảng các file và trả về mảng các file đã được upload lên Cloudinary
 * Mỗi phần tử trong mảng files có cấu trúc: { file, type }
 * @param {Array} files - Mảng chứa các đối tượng file cần upload
 * @returns {Array} uploaded - Mảng chứa kết quả upload, mỗi phần tử có cấu trúc: { file: res, type }
 */
export const uploadFiles = async (files) => {
  // Tạo một đối tượng FormData để gửi dữ liệu file lên Cloudinary
  let formData = new FormData();
  // Append upload preset (sử dụng cloud_secret làm upload preset)
  formData.append("upload_preset", cloud_secret);
  // Mảng lưu trữ kết quả upload
  let uploaded = [];
  // Duyệt qua từng file trong mảng files
  for (const f of files) {
    // Lấy thông tin file và type từ đối tượng f
    const { file, type } = f;
    // Append file vào FormData
    formData.append("file", file);
    // Gọi hàm uploadToCloudinary để upload file và chờ kết quả trả về
    let res = await uploadToCloudinary(formData);
    // Sau khi upload thành công, đẩy đối tượng kết quả vào mảng uploaded
    uploaded.push({
      file: res, // Dữ liệu trả về từ Cloudinary (bao gồm URL, thông tin file,...)
      type: type, // Loại file được chỉ định ban đầu
    });
  }
  // Trả về mảng các file đã upload
  return uploaded;
};

/**
 * Hàm uploadToCloudinary thực hiện việc gửi POST request đến Cloudinary API để upload file.
 * Hàm trả về Promise chứa dữ liệu từ Cloudinary nếu upload thành công.
 * @param {FormData} formData - Đối tượng FormData chứa file và các thông tin cần thiết
 * @returns {Promise} - Promise trả về dữ liệu upload từ Cloudinary
 */
const uploadToCloudinary = async (formData) => {
  return new Promise(async (resolve) => {
    // Gửi POST request đến Cloudinary API endpoint để upload file dạng "raw"
    return await axios
      .post(
        `https://api.cloudinary.com/v1_1/${cloud_name}/raw/upload`,
        formData
      )
      .then(({ data }) => {
        // Nếu upload thành công, resolve Promise với dữ liệu trả về
        resolve(data);
      })
      .catch((err) => {
        // Nếu có lỗi, in lỗi ra console (có thể cải thiện để xử lý lỗi thêm)
        console.log(err);
      });
  });
};
