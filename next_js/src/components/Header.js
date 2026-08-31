'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
    const { user, ready, logout } = useAuth();

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #ddd' }}>
            <Link href="/" style={{ fontWeight: 'bold', fontSize: 20, textDecoration: 'none', color: 'inherit' }}>
                게시판
            </Link>
            <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                {!ready ? null : user ? (
                    <>
                        <span>{user.name}님</span>
                        <Link href="/board/write">글쓰기</Link>
                        <button onClick={logout}>로그아웃</button>
                    </>
                ) : (
                    <>
                        <Link href="/login">로그인</Link>
                        <Link href="/join">회원가입</Link>
                    </>
                )}
            </nav>
        </header>
    );
}
