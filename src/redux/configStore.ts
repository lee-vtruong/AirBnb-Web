import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
// Import các slice khác ở đây khi bạn tạo chúng
// ví dụ: import roomReducer from './slices/roomSlice';

export const store = configureStore({
  reducer: {
    // Tên 'auth' sẽ là key trong RootState: state.auth
    auth: authReducer,
    // room: roomReducer,
  },
  // Bật Redux DevTools
  devTools: process.env.NODE_ENV !== 'production',
});

// Định nghĩa kiểu cho toàn bộ state của ứng dụng (RootState)
export type RootState = ReturnType<typeof store.getState>;

// Định nghĩa kiểu cho hàm dispatch, nó sẽ biết về các thunk actions
export type AppDispatch = typeof store.dispatch;