// Hàm getConversationId: Lấy ID của người dùng đối phương trong cuộc trò chuyện
// Nếu users[0] trùng với user hiện tại, trả về ID của users[1]; ngược lại, trả về ID của users[0]
export const getConversationId = (user, users) => {
  return users[0]._id === user._id ? users[1]._id : users[0]._id;
};

// Hàm getConversationName: Lấy tên của người dùng đối phương trong cuộc trò chuyện
// So sánh ID của users[0] với user hiện tại, nếu trùng khớp thì trả về tên của users[1], ngược lại trả về tên của users[0]
export const getConversationName = (user, users) => {
  return users[0]._id === user._id ? users[1].name : users[0].name;
};

// Hàm getConversationPicture: Lấy ảnh đại diện của người dùng đối phương trong cuộc trò chuyện
// Nếu users[0] trùng với user hiện tại, trả về ảnh của users[1]; nếu không trả về ảnh của users[0]
export const getConversationPicture = (user, users) => {
  return users[0]._id === user._id ? users[1].picture : users[0].picture;
};

// Hàm checkOnlineStatus: Kiểm tra trạng thái online của người dùng đối phương
// - onlineUsers: danh sách người dùng đang online (mỗi phần tử có thuộc tính userId)
// - user: người dùng hiện tại
// - users: mảng chứa 2 user của cuộc trò chuyện
// Hàm trả về true nếu người dùng đối phương có trong danh sách onlineUsers, ngược lại trả về false.
export const checkOnlineStatus = (onlineUsers, user, users) => {
  // Lấy ID của người dùng đối phương
  let convoId = getConversationId(user, users);
  // Tìm trong danh sách onlineUsers một phần tử có userId trùng với ID của người đối phương
  let check = onlineUsers.find((u) => u.userId === convoId);
  return check ? true : false;
};
