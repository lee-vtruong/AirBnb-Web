'use client';

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { BinhLuan } from '@/types/comment.types';
import binhLuanService from '@/services/binhLuanService';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

interface CommentSectionProps {
    roomId: number;
}

export default function CommentSection({ roomId }: CommentSectionProps) {
    const { currentUser } = useAppSelector((state) => state.auth);
    const [comments, setComments] = useState<BinhLuan[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [newComment, setNewComment] = useState('');
    const [rating, setRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchComments = async () => {
        if (!roomId) return;
        setIsLoading(true);
        try {
            const response = await binhLuanService.getBinhLuanTheoPhong(roomId);
            setComments(response.data || []);
        } catch (error) {
            console.error("Failed to fetch comments:", error);
            toast.error("Không thể tải được danh sách bình luận.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [roomId]);

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) {
            toast.warn("Vui lòng đăng nhập để bình luận.");
            return;
        }
        if (!newComment.trim()) {
            toast.warn("Vui lòng nhập nội dung bình luận.");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                maPhong: roomId,
                maNguoiBinhLuan: currentUser.id,
                ngayBinhLuan: dayjs().toISOString(), 
                noiDung: newComment,
                saoBinhLuan: rating,
            };

            await binhLuanService.postBinhLuan(payload);
            toast.success("Gửi bình luận thành công!");

            setNewComment('');
            setRating(5);
            fetchComments(); 

        } catch (error: any) {
            const errorMessage = error.response?.data?.content || "Gửi bình luận thất bại.";
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-semibold mb-6">{comments.length} Bình luận</h2>

            {currentUser && (
                <form onSubmit={handleSubmitComment} className="mb-8 p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-black font-semibold mb-2">Để lại bình luận của bạn</h3>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={4}
                        placeholder="Cảm nhận của bạn về nơi này..."
                        className="text-gray-500 w-full p-2 border rounded-md focus:ring-rose-500 focus:border-rose-500"
                    />
                    <div className="flex items-center justify-between mt-2">
                        <div>
                            <label className="text-black mr-2 font-medium">Đánh giá:</label>
                            <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="text-amber-400 p-2 border rounded-md">
                                {[5, 4, 3, 2, 1].map(star => <option key={star} value={star}>{star} sao</option>)}
                            </select>
                        </div>
                        <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600 disabled:bg-rose-300">
                            {isSubmitting ? 'Đang gửi...' : 'Gửi'}
                        </button>
                    </div>
                </form>
            )}

            {isLoading ? (
                <p>Đang tải bình luận...</p>
            ) : comments.length > 0 ? (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex space-x-4">
                            <img
                                src={comment.avatar || `https://i.pravatar.cc/150?u=${comment.maNguoiBinhLuan}`}
                                alt={comment.tenNguoiBinhLuan}
                                className="w-12 h-12 rounded-full object-cover bg-gray-200"
                            />
                            <div>
                                <div className="flex items-center space-x-2">
                                    <h4 className="font-bold">{comment.tenNguoiBinhLuan}</h4>
                                    <span className="text-sm text-gray-500">{dayjs(comment.ngayBinhLuan).format('DD/MM/YYYY')}</span>
                                </div>
                                <div className="flex items-center my-1">
                                    {[...Array(comment.saoBinhLuan)].map((_, i) => (
                                        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-500"><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" /></svg>
                                    ))}
                                </div>
                                <p className="text-gray-700">{comment.noiDung}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Chưa có bình luận nào cho phòng này. Hãy là người đầu tiên để lại đánh giá!</p>
            )}
        </div>
    );
}