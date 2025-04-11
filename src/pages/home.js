import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Peer from "simple-peer/simplepeer.min.js"; // Sử dụng thư viện simple-peer để thiết lập kết nối WebRTC cho cuộc gọi video
import { ChatappHome, ChatContainer } from "../components/Chat"; // Các component giao diện chính của chat
import { Sidebar } from "../components/sidebar"; // Component Sidebar hiển thị danh sách cuộc hội thoại, thông tin người dùng...
import SocketContext from "../context/SocketContext"; // Context chứa đối tượng socket (Socket.IO)
import {
  getConversations,
  updateMessagesAndConversations,
} from "../features/chatSlice"; // Các action và async thunk của chatSlice
import Call from "../components/Chat/call/Call"; // Component Call hiển thị giao diện cuộc gọi
import {
  getConversationId,
  getConversationName,
  getConversationPicture,
} from "../utils/chat"; // Các hàm tiện ích để lấy thông tin của cuộc hội thoại (ID, tên, ảnh)

// Dữ liệu mặc định cho trạng thái cuộc gọi
const callData = {
  socketId: "",
  receiveingCall: false,
  callEnded: false,
  name: "",
  picture: "",
  signal: "",
};

function Home({ socket }) {
  const dispatch = useDispatch();

  // Lấy thông tin user từ Redux store
  const { user } = useSelector((state) => state.user);
  // Lấy thông tin cuộc hội thoại active từ Redux store
  const { activeConversation } = useSelector((state) => state.chat);

  // State lưu danh sách người dùng online (được gửi từ server qua socket)
  const [onlineUsers, setOnlineUsers] = useState([]);

  // ----------------- Xử lý cuộc gọi -----------------
  const [call, setCall] = useState(callData); // State lưu thông tin cuộc gọi hiện tại
  const [stream, setStream] = useState(); // Lưu stream media của người dùng (video, audio)
  const [show, setShow] = useState(false); // Quản lý hiển thị giao diện cuộc gọi
  const { receiveingCall, callEnded, socketId } = call; // Giải cấu trúc các thuộc tính của call
  const [callAccepted, setCallAccepted] = useState(false); // State xác định cuộc gọi đã được chấp nhận chưa
  const [totalSecInCall, setTotalSecInCall] = useState(0); // Lưu số giây cuộc gọi đã diễn ra (nếu cần)

  // useRef để tham chiếu các phần tử video
  const myVideo = useRef(); // Video stream của người dùng
  const userVideo = useRef(); // Video stream của người đối phương khi nhận cuộc gọi
  // Ref để lưu kết nối WebRTC
  const connectionRef = useRef();

  // ----------------- Xử lý "typing" -----------------
  const [typing, setTyping] = useState(false);

  // ----------------- Socket: Khi user join -----------------
  useEffect(() => {
    // Khi component Home được mount, gửi sự kiện "join" với user._id tới server qua socket
    socket.emit("join", user._id);
    // Lắng nghe sự kiện "get-online-users" để cập nhật danh sách người dùng online
    socket.on("get-online-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]); // Chạy lại khi thông tin user thay đổi

  // ----------------- Xử lý cuộc gọi -----------------
  useEffect(() => {
    // Thiết lập media (video/audio) cho cuộc gọi
    setupMedia();
    // Lắng nghe sự kiện "setup socket" từ server để cập nhật socketId cho cuộc gọi
    socket.on("setup socket", (id) => {
      setCall({ ...call, socketId: id });
    });
    // Khi nhận được sự kiện "call user" từ server (người khác gọi tới)
    socket.on("call user", (data) => {
      setCall({
        ...call,
        socketId: data.from, // Socket của người gọi
        name: data.name, // Tên của người gọi
        picture: data.picture, // Ảnh đại diện của người gọi
        signal: data.signal, // Signal của cuộc gọi WebRTC
        receiveingCall: true, // Đánh dấu rằng có cuộc gọi đến
      });
    });
    // Khi nhận được sự kiện "end call" từ server, dừng cuộc gọi
    socket.on("end call", () => {
      setShow(false);
      setCall({ ...call, callEnded: true, receiveingCall: false });
      // Xóa stream của video của người dùng
      myVideo.current.srcObject = null;
      // Nếu cuộc gọi đã được chấp nhận, hủy kết nối WebRTC
      if (callAccepted) {
        connectionRef?.current?.destroy();
      }
    });
  }, []); // Chạy một lần khi mount

  // ----------------- Hàm gọi người dùng (call user) -----------------
  const callUser = () => {
    // Bật media (hiển thị video của người dùng)
    enableMedia();
    // Cập nhật thông tin cuộc gọi với tên và ảnh dựa trên cuộc hội thoại active
    setCall({
      ...call,
      name: getConversationName(user, activeConversation.users),
      picture: getConversationPicture(user, activeConversation.users),
    });
    // Tạo kết nối WebRTC, đánh dấu mình là initiator (người gọi)
    const peer = new Peer({
      initiator: true,
      trickle: false, // Tắt trickle ICE để gửi toàn bộ signal trong 1 lần
      stream: stream, // Gửi stream media của người dùng
    });
    // Khi peer có dữ liệu signal, gửi sự kiện "call user" qua socket tới người nhận
    peer.on("signal", (data) => {
      socket.emit("call user", {
        userToCall: getConversationId(user, activeConversation.users),
        signal: data,
        from: socketId,
        name: user.name,
        picture: user.picture,
      });
    });
    // Khi nhận được stream từ người nhận, gán vào userVideo (để hiển thị video người nhận)
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    // Lắng nghe sự kiện "call accepted" từ server: khi người nhận chấp nhận cuộc gọi, nhận signal và tiến hành thiết lập kết nối
    socket.on("call accepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
    // Lưu kết nối WebRTC vào connectionRef để có thể hủy kết nối sau
    connectionRef.current = peer;
  };

  // ----------------- Hàm trả lời cuộc gọi -----------------
  const answerCall = () => {
    // Bật media (hiển thị video của mình)
    enableMedia();
    setCallAccepted(true);
    // Tạo đối tượng Peer cho cuộc gọi, ở đây mình không phải initiator
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    // Khi peer có dữ liệu signal, gửi sự kiện "answer call" qua socket tới người gọi
    peer.on("signal", (data) => {
      socket.emit("answer call", { signal: data, to: call.socketId });
    });
    // Khi nhận được stream từ người gọi, gán vào userVideo để hiển thị video của người gọi
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    // Gửi signal nhận được từ cuộc gọi để thiết lập kết nối
    peer.signal(call.signal);
    // Lưu đối tượng peer vào connectionRef
    connectionRef.current = peer;
  };

  // ----------------- Hàm kết thúc cuộc gọi -----------------
  const endCall = () => {
    setShow(false); // Ẩn giao diện cuộc gọi
    setCall({ ...call, callEnded: true, receiveingCall: false });
    myVideo.current.srcObject = null; // Xóa stream video của mình
    socket.emit("end call", call.socketId); // Gửi sự kiện kết thúc cuộc gọi tới server
    connectionRef?.current?.destroy(); // Hủy kết nối WebRTC nếu có
  };

  // ----------------- Thiết lập media (video, audio) -----------------
  const setupMedia = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream); // Lưu stream media vào state
      });
  };

  // ----------------- Kích hoạt media -----------------
  const enableMedia = () => {
    if (myVideo.current && stream) {
      myVideo.current.srcObject = stream;
    }
    setShow(true);
  };

  // ----------------- Lấy danh sách cuộc hội thoại -----------------
  useEffect(() => {
    if (user?.token) {
      dispatch(getConversations(user.token));
    }
  }, [user]);

  // ----------------- Lắng nghe các sự kiện từ socket -----------------
  useEffect(() => {
    // Khi nhận được tin nhắn mới từ socket, cập nhật tin nhắn và cuộc hội thoại tương ứng
    socket.on("receive message", (message) => {
      dispatch(updateMessagesAndConversations(message));
    });
    // Lắng nghe sự kiện "typing" để cập nhật trạng thái gõ tin nhắn
    socket.on("typing", (conversation) => setTyping(conversation));
    // Lắng nghe sự kiện "stop typing" để đặt trạng thái gõ tin nhắn thành false
    socket.on("stop typing", () => setTyping(false));
  }, []);

  return (
    <>
      {/* Container chính của trang Home */}
      <div className="h-screen dark:bg-dark_bg_1 flex items-center justify-center overflow-hidden">
        {/* Container chứa Sidebar và Chat */}
        <div className="container h-screen flex py-[19px]">
          {/* Sidebar hiển thị danh sách cuộc hội thoại, thông tin người dùng, trạng thái online, ... */}
          <Sidebar onlineUsers={onlineUsers} typing={typing} />
          {/* Nếu có cuộc hội thoại active, hiển thị ChatContainer; nếu không, hiển thị ChatappHome */}
          {activeConversation._id ? (
            <ChatContainer
              onlineUsers={onlineUsers}
              callUser={callUser}
              typing={typing}
            />
          ) : (
            <ChatappHome />
          )}
        </div>
      </div>
      {/* Giao diện cuộc gọi: hiển thị khi có stream hoặc khi nhận signal từ cuộc gọi mà chưa kết thúc */}
      <div className={(show || call.signal) && !call.callEnded ? "" : "hidden"}>
        <Call
          call={call}
          setCall={setCall}
          callAccepted={callAccepted}
          myVideo={myVideo}
          userVideo={userVideo}
          stream={stream}
          answerCall={answerCall}
          show={show}
          endCall={endCall}
          totalSecInCall={totalSecInCall}
          setTotalSecInCall={setTotalSecInCall}
        />
      </div>
    </>
  );
}

// Bọc component Home bằng SocketContext.Consumer để lấy đối tượng socket từ context và truyền vào component Home
const HomeWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Home {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default HomeWithSocket;
