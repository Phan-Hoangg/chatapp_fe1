import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Định nghĩa endpoint API cho cuộc hội thoại và tin nhắn dựa trên biến môi trường
const CONVERSATION_ENDPOINT = `${process.env.REACT_APP_API_ENDPOINT}/conversation`;
const MESSAGE_ENDPOINT = `${process.env.REACT_APP_API_ENDPOINT}/message`;

// Khởi tạo state ban đầu của slice chat
const initialState = {
  status: "",               // Trạng thái của các thao tác (loading, succeeded, failed)
  error: "",                // Lỗi nếu có xảy ra
  conversations: [],        // Danh sách các cuộc hội thoại
  activeConversation: {},   // Cuộc hội thoại đang active
  messages: [],             // Danh sách tin nhắn của cuộc hội thoại active
  notifications: [],        // Danh sách thông báo (chưa được sử dụng trong code này)
  files: [],                // Danh sách file đính kèm được thêm vào khi gửi tin nhắn
};

// Async thunk: Lấy tất cả các cuộc hội thoại
export const getConversations = createAsyncThunk(
  "conervsation/all",
  async (token, { rejectWithValue }) => {
    try {
      // Gửi GET request đến endpoint lấy danh sách cuộc hội thoại, kèm token trong header
      const { data } = await axios.get(CONVERSATION_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data; // Trả về dữ liệu cuộc hội thoại
    } catch (error) {
      // Nếu có lỗi, trả về thông báo lỗi thông qua rejectWithValue
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

// Async thunk: Mở hoặc tạo cuộc hội thoại (cho chat cá nhân hoặc nhóm)
export const open_create_conversation = createAsyncThunk(
  "conervsation/open_create",
  async (values, { rejectWithValue }) => {
    const { token, receiver_id, isGroup } = values;
    try {
      // Gửi POST request với receiver_id và isGroup để mở hoặc tạo cuộc hội thoại
      const { data } = await axios.post(
        CONVERSATION_ENDPOINT,
        { receiver_id, isGroup },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data; // Trả về dữ liệu cuộc hội thoại mới mở/được tạo
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

// Async thunk: Lấy tin nhắn của một cuộc hội thoại
export const getConversationMessages = createAsyncThunk(
  "conervsation/messages",
  async (values, { rejectWithValue }) => {
    const { token, convo_id } = values;
    try {
      // Gửi GET request đến endpoint tin nhắn dựa trên id của cuộc hội thoại
      const { data } = await axios.get(`${MESSAGE_ENDPOINT}/${convo_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data; // Trả về danh sách tin nhắn
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

// Async thunk: Gửi tin nhắn
export const sendMessage = createAsyncThunk(
  "message/send",
  async (values, { rejectWithValue }) => {
    const { token, message, convo_id, files } = values;
    try {
      // Gửi POST request đến endpoint tin nhắn với dữ liệu tin nhắn, id cuộc hội thoại và file đính kèm
      const { data } = await axios.post(
        MESSAGE_ENDPOINT,
        {
          message,
          convo_id,
          files,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data; // Trả về dữ liệu tin nhắn mới được gửi
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

// Async thunk: Tạo cuộc hội thoại nhóm
export const createGroupConversation = createAsyncThunk(
  "conervsation/create_group",
  async (values, { rejectWithValue }) => {
    const { token, name, users } = values;
    try {
      // Gửi POST request đến endpoint group để tạo cuộc hội thoại nhóm với tên nhóm và danh sách user
      const { data } = await axios.post(
        `${CONVERSATION_ENDPOINT}/group`,
        { name, users },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data; // Trả về dữ liệu cuộc hội thoại nhóm mới được tạo
    } catch (error) {
      return rejectWithValue(error.response.data.error.message);
    }
  }
);

// Tạo slice chat với các reducers và extraReducers để xử lý các async thunk
export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Thiết lập cuộc hội thoại active
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    // Cập nhật tin nhắn mới và danh sách cuộc hội thoại khi có tin nhắn mới được gửi
    updateMessagesAndConversations: (state, action) => {
      // Cập nhật danh sách tin nhắn nếu tin nhắn thuộc cuộc hội thoại active
      let convo = state.activeConversation;
      if (convo._id === action.payload.conversation._id) {
        state.messages = [...state.messages, action.payload];
      }
      // Cập nhật thông tin cuộc hội thoại: gắn tin nhắn mới nhất vào cuộc hội thoại
      let conversation = {
        ...action.payload.conversation,
        latestMessage: action.payload,
      };
      // Loại bỏ cuộc hội thoại cũ ra khỏi danh sách và đưa cuộc hội thoại mới nhất lên đầu danh sách
      let newConvos = [...state.conversations].filter(
        (c) => c._id !== conversation._id
      );
      newConvos.unshift(conversation);
      state.conversations = newConvos;
    },
    // Thêm file vào danh sách file đính kèm
    addFiles: (state, action) => {
      state.files = [...state.files, action.payload];
    },
    // Xóa sạch danh sách file đính kèm
    clearFiles: (state, action) => {
      state.files = [];
    },
    // Xóa một file cụ thể khỏi danh sách file đính kèm dựa trên index
    removeFileFromFiles: (state, action) => {
      let index = action.payload;
      let files = [...state.files];
      let fileToRemove = [files[index]];
      state.files = files.filter((file) => !fileToRemove.includes(file));
    },
  },
  extraReducers(builder) {
    builder
      // Xử lý trạng thái pending, fulfilled, rejected của async thunk getConversations
      .addCase(getConversations.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getConversations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversations = action.payload;
      })
      .addCase(getConversations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Xử lý open_create_conversation
      .addCase(open_create_conversation.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(open_create_conversation.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.activeConversation = action.payload;
        state.files = []; // Reset danh sách file khi mở cuộc hội thoại mới
      })
      .addCase(open_create_conversation.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Xử lý getConversationMessages
      .addCase(getConversationMessages.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(getConversationMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages = action.payload;
      })
      .addCase(getConversationMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Xử lý sendMessage
      .addCase(sendMessage.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Cập nhật danh sách tin nhắn cho cuộc hội thoại active
        state.messages = [...state.messages, action.payload];
        // Cập nhật cuộc hội thoại với tin nhắn mới nhất
        let conversation = {
          ...action.payload.conversation,
          latestMessage: action.payload,
        };
        // Loại bỏ cuộc hội thoại cũ và đưa cuộc hội thoại mới nhất lên đầu danh sách
        let newConvos = [...state.conversations].filter(
          (c) => c._id !== conversation._id
        );
        newConvos.unshift(conversation);
        state.conversations = newConvos;
        state.files = []; // Reset danh sách file sau khi gửi tin nhắn
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Xuất các action để sử dụng trong các component
export const {
  setActiveConversation,
  updateMessagesAndConversations,
  addFiles,
  clearFiles,
  removeFileFromFiles,
} = chatSlice.actions;

// Xuất reducer của chatSlice để cấu hình store
export default chatSlice.reducer;
