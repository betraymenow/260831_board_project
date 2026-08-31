'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function Home() {
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const limit = 10;

    useEffect(() => {
        setLoading(true);
        api.boardList(page, limit).then((res) => {
            if (res.success) {
                setList(res.data);
                setTotal(res.total);
            }
            setLoading(false);
        });
    }, [page]);

    const totalPages = Math.max(Math.ceil(total / limit), 1);

    return (
        <div>
            <h1>게시글 목록</h1>
            {loading ? (
                <p>불러오는 중...</p>
            ) : list.length === 0 ? (
                <p>게시글이 없습니다.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #333' }}>
                            <th style={{ textAlign: 'left', padding: 8 }}>제목</th>
                            <th style={{ padding: 8 }}>작성자</th>
                            <th style={{ padding: 8 }}>조회수</th>
                            <th style={{ padding: 8 }}>작성일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {list.map((b) => (
                            <tr key={b._id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: 8 }}>
                                    <Link href={`/board/${b._id}`}>{b.title}</Link>
                                </td>
                                <td style={{ padding: 8, textAlign: 'center' }}>{b.writer}</td>
                                <td style={{ padding: 8, textAlign: 'center' }}>{b.views}</td>
                                <td style={{ padding: 8, textAlign: 'center' }}>
                                    {new Date(b.createdAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
                <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                    이전
                </button>
                <span>{page} / {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                    다음
                </button>
            </div>
        </div>
    );
}
