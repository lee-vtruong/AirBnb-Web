import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './configStore';

// Tạo và export các hook đã được "typed"
// Hãy sử dụng chúng trong toàn bộ ứng dụng thay vì `useDispatch` và `useSelector` gốc
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;