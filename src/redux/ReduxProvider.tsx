'use client';

import { Provider } from 'react-redux';
import { store } from './configStore';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Component này sẽ bọc toàn bộ ứng dụng trong layout.tsx
export default function ReduxProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            {children}
            {/* Đặt ToastContainer ở đây để dùng được trong toàn bộ app */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
            />
        </Provider>
    );
}