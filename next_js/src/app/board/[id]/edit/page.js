'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function EditPage() {
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const [loaded, setLoaded] = useState(false);
    const router = useRouter();
    const { user, token, ready } = useAuth();

    useEffect(() => {
        if (!ready) return;
        if (!token) {
            router.push('/login');
            return;
        }
        api.boardGet(id).then((res) => {
            if (!res.success) {
                setError('존재하지 않는 게시글입니다.');
                return;
            }
            if (res.data.writer !== user?.id) {
                alert('작성자만 수정할 수 있습니다.');
                router.push(`/board/${id}`);
                return;
            }
            setTitle(res.data.title);
            setContent(res.data.content);
            setLoaded(true);
        });
    }, [id, ready, token, user, router]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        const res = await api.boardUpdate(id, { title, content }, token);
        if (res.success) {
            router.push(`/board/${id}`);
        } else {
            setError(res.msg || '수정에 실패했습니다.');
        }
    }

    if (!loaded) return <p>{error || '불러오는 중...'}</p>;

    return (
        <div>
            <h1>글 수정</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={100} />
                <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={10} />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">수정 완료</button>
            </form>
        </div>
    );
}
