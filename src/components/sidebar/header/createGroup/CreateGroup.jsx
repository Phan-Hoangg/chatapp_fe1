import { useState } from "react";
import { ReturnIcon, ValidIcon } from "../../../../svg";
import UnderlineInput from "./UnderlineInput";
import MultipleSelect from "./MultipleSelect";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { createGroupConversation } from "../../../../features/chatSlice";

// Component CreateGroup cho phép người dùng tạo một cuộc trò chuyện nhóm mới
export default function CreateGroup({ setShowCreateGroup }) {
  // Khởi tạo dispatch để gửi action lên Redux store
  const dispatch = useDispatch();
  // Lấy thông tin người dùng từ Redux store
  const { user } = useSelector((state) => state.user);
  // Lấy trạng thái hiện tại của chat (để kiểm tra trạng thái loading) từ Redux store
  const { status } = useSelector((state) => state.chat);

  // State lưu tên nhóm
  const [name, setName] = useState("");
  // State lưu kết quả tìm kiếm người dùng khi nhập từ khóa
  const [searchResults, setSearchResults] = useState([]);
  // State lưu danh sách người dùng được chọn (danh sách các thành viên của nhóm)
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Hàm handleSearch xử lý tìm kiếm người dùng khi nhập từ khóa
  const handleSearch = async (e) => {
    // Nếu có giá trị nhập và phím Enter được nhấn
    if (e.target.value && e.key === "Enter") {
      // Reset kết quả tìm kiếm trước đó
      setSearchResults([]);
      try {
        // Gửi request GET đến API với query search
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_ENDPOINT}/user?search=${e.target.value}`,
          {
            headers: {
              // Gửi token xác thực trong header
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        // Nếu có dữ liệu trả về (tồn tại kết quả tìm kiếm)
        if (data.length > 0) {
          let tempArray = [];
          // Lặp qua từng người dùng trả về và chuyển đổi thành đối tượng với các thuộc tính cần thiết
          data.forEach((user) => {
            let temp = {
              value: user._id,
              label: user.name,
              picture: user.picture,
            };
            tempArray.push(temp);
          });
          // Cập nhật state searchResults với mảng các đối tượng người dùng
          setSearchResults(tempArray);
        } else {
          // Nếu không có dữ liệu trả về thì reset mảng searchResults
          setSearchResults([]);
        }
      } catch (error) {
        // Nếu có lỗi xảy ra, in ra thông báo lỗi trong console
        console.log(error.response.data.error.message);
      }
    } else {
      // Nếu không nhập giá trị, reset mảng searchResults
      setSearchResults([]);
    }
  };

  // Hàm createGroupHandler xử lý việc tạo nhóm khi người dùng nhấn nút tạo nhóm
  const createGroupHandler = async () => {
    // Chỉ thực hiện nếu trạng thái không phải "loading"
    if (status !== "loading") {
      // Tạo mảng users chứa danh sách id của người dùng được chọn
      let users = [];
      selectedUsers.forEach((user) => {
        users.push(user.value);
      });
      // Tạo đối tượng values chứa tên nhóm, danh sách thành viên và token người dùng
      let values = {
        name,
        users,
        token: user.token,
      };
      // Dispatch action createGroupConversation với values
      let newConvo = await dispatch(createGroupConversation(values));
      // Sau khi tạo nhóm thành công, ẩn modal tạo nhóm
      setShowCreateGroup(false);
    }
  };

  return (
    <div className="createGroupAnimation relative flex0030 h-full z-40">
      {/* Container của modal tạo nhóm */}
      <div className="mt-5">
        {/* Nút Return/Close để đóng modal tạo nhóm */}
        <button
          className="btn w-6 h-6 border"
          onClick={() => setShowCreateGroup(false)}
        >
          <ReturnIcon className="fill-white" />
        </button>
        {/* Ô nhập tên nhóm sử dụng component UnderlineInput */}
        <UnderlineInput name={name} setName={setName} />
        {/* Component MultipleSelect cho phép tìm kiếm và chọn nhiều người dùng để thêm vào nhóm */}
        <MultipleSelect
          selectedUsers={selectedUsers}
          searchResults={searchResults}
          setSelectedUsers={setSelectedUsers}
          handleSearch={handleSearch}
        />
        {/* Nút tạo nhóm được căn giữa ở giữa màn hình */}
        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2">
          <button
            className="btn bg-green_1 scale-150 hover:bg-green-500"
            onClick={() => createGroupHandler()}
          >
            {status === "loading" ? (
              // Nếu trạng thái đang loading, hiển thị loader (ClipLoader)
              <ClipLoader color="#E9EDEF" size={25} />
            ) : (
              // Nếu không, hiển thị biểu tượng ValidIcon
              <ValidIcon className="fill-white mt-2 h-full" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
