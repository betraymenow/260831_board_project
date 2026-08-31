'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function BoardDetailPage() {
    const { id } = useParams();
    const [board, setBoard] = useState(null);
    const [notFound, setNotFound] = useState(false);
    const router = useRouter();
    const { user, token } = useAuth();

    useEffect(() => {
        api.boardGet(id).then((res) => {
            if (res.success) setBoard(res.data);
            else setNotFound(true);
        });
    }, [id]);

    async function handleDelete() {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        const res = await api.boardDelete(id, token);
        if (res.success) {
            router.push('/');
        } else {
            alert(res.msg || '삭제에 실패했습니다.');
        }
    }

    if (notFound) return <p>존재하지 않는 게시글입니다.</p>;
    if (!board) return <p>불러오는 중...</p>;

    const isOwner = user && user.id === board.writer;

    return (
        <div>
            <h1>{board.title}</h1>
            <div style={{ color: '#666', display: 'flex', gap: 12, marginBottom: 16 }}>
                <span>작성자: {board.writer}</span>
                <span>조회수: {board.views}</span>
                <span>{new Date(board.createdAt).toLocaleString()}</span>
            </div>
            <p style={{ whiteSpace: 'pre-wrap', minHeight: 120 }}>{board.content}</p>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <Link href="/">목록</Link>
                {isOwner && (
                    <>
                        <Link href={`/board/${id}/edit`}>수정</Link>
                        <button onClick={handleDelete}>삭제</button>
                    </>
                )}
            </div>
        </div>
    );
}
