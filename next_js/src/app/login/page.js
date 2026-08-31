'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
    const [id, setId] = useState('');
    const [pw, setPw] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { login } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        const res = await api.login({ id, pw });
        if (res.success) {
            login(res.token, res.data);
            router.push('/');
        } else {
            setError(res.msg || '로그인에 실패했습니다.');
        }
    }

    return (
        <div>
            <h1>로그인</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320 }}>
                <input placeholder="아이디" value={id} onChange={(e) => setId(e.target.value)} required />
                <input placeholder="비밀번호" type="password" value={pw} onChange={(e) => setPw(e.target.value)} required />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">로그인</button>
            </form>
        </div>
    );
}
