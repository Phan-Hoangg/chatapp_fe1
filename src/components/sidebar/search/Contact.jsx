import { useDispatch, useSelector } from "react-redux"; // Import hook dùng để gửi action và lấy dữ liệu từ Redux store
import SocketContext from "../../../context/SocketContext"; // Import context để lấy đối tượng socket
import { open_create_conversation } from "../../../features/chatSlice"; // Import action mở hoặc tạo cuộc hội thoại từ chatSlice

// Component Contact hiển thị thông tin liên lạc (contact) và xử lý sự kiện mở cuộc hội thoại khi người dùng click vào contact
function Contact({ contact, setSearchResults, socket }) {
  // Khởi tạo dispatch để gửi action lên Redux store
  const dispatch = useDispatch();
  // Lấy thông tin người dùng từ Redux store (state.user)
  const { user } = useSelector((state) => state.user);
  // Lấy token của người dùng để gửi đi yêu cầu mở cuộc hội thoại
  const { token } = user;

  // Tạo đối tượng values chứa thông tin cần thiết để mở cuộc hội thoại:
  // - receiver_id: ID của contact được chọn
  // - token: token của người dùng (để xác thực ở backend)
  const values = {
    receiver_id: contact._id,
    token,
  };

  // Hàm xử lý khi mở cuộc hội thoại
  const openConversation = async () => {
    // Dispatch action open_create_conversation với các giá trị cần thiết
    let newConvo = await dispatch(open_create_conversation(values));
    // Sau khi mở hoặc tạo cuộc hội thoại thành công, tham gia room của cuộc hội thoại thông qua socket
    socket.emit("join conversation", newConvo.payload._id);
  };

  return (
    <li
      onClick={() => openConversation()} // Khi click vào contact, gọi hàm mở cuộc hội thoại
      className="list-none h-[72px] hover:dark:bg-dark_bg_2 cursor-pointer dark:text-dark_text_1 px-[10px]"
    >
      {/* Container hiển thị thông tin của contact */}
      <div className="flex items-center gap-x-3 py-[10px]">
        {/* Phần chứa thông tin của contact */}
        <div className="flex items-center gap-x-3">
          {/* Hình đại diện của contact */}
          <div className="relative min-w-[50px] max-w-[50px] h-[50px] rounded-full overflow-hidden">
            <img
              src={contact.picture} // Ảnh đại diện của contact
              alt={contact.name} // Alt text hiển thị tên contact
              className="w-full h-full object-cover"
            />
          </div>
          {/* Thông tin tên và trạng thái của contact */}
          <div className="w-full flex flex-col">
            {/* Tên của contact */}
            <h1 className="font-bold flex items-center gap-x-2">
              {contact.name}
            </h1>
            {/* Trạng thái của contact */}
            <div>
              <div className="flex items-center gap-x-1 dark:text-dark_text_2">
                <div className="flex-1 items-center gap-x-1 dark:text-dark_text_2">
                  <p>{contact.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Phần vạch chân dưới để phân cách các contact */}
      <div className="ml-16 border-b dark:border-b-dark_border_1"></div>
    </li>
  );
}

// Bọc component Contact bằng SocketContext.Consumer để lấy đối tượng socket từ context
const ContactWithContext = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Contact {...props} socket={socket} />}
  </SocketContext.Consumer>
);

// Export component đã được bọc context
export default ContactWithContext;
