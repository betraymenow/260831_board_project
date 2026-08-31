'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function JoinPage() {
    const [form, setForm] = useState({ id: '', pw: '', name: '', phone: '' });
    const [error, setError] = useState('');
    const router = useRouter();

    function update(key) {
        return (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');
        const res = await api.join(form);
        if (res.success) {
            router.push('/login');
        } else {
            setError(res.message || '회원가입에 실패했습니다.');
        }
    }

    return (
        <div>
            <h1>회원가입</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320 }}>
                <input placeholder="아이디 (4자 이상)" value={form.id} onChange={update('id')} required minLength={4} />
                <input placeholder="비밀번호" type="password" value={form.pw} onChange={update('pw')} required />
                <input placeholder="이름" value={form.name} onChange={update('name')} required />
                <input placeholder="전화번호" value={form.phone} onChange={update('phone')} />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit">가입하기</button>
            </form>
        </div>
    );
}
