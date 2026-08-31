'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function WritePage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { token, ready } = useAuth();

    useEffect(() => {
        if (ready && !token) router.push('/login');
    }, [ready, token, router]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        const res = await api.boardWrite({ title, content }, token);
        if (res.success) {
            router.push(`/board/${res.data._id}`);
        } else {
            setError(res.msg || '글 작성에 실패했습니다.');
        }
    }

    if (!ready || !token) return null;

    return (
        <div>
            <h1>글쓰기</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={100} />
                <textarea placeholder="내용" value={content} onChange={(e) => setContent(e.target.value)} required rows={10} />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">등록</button>
            </form>
        </div>
    );
}
