const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function request(path, { method = 'GET', body, token } = {}) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = token;

    const res = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        cache: 'no-store'
    });
    return res.json();
}

export const api = {
    join: (data) => request('/member/join', { method: 'POST', body: data }),
    login: (data) => request('/member/login', { method: 'POST', body: data }),
    check: (token) => request('/member/check', { token }),

    boardList: (page = 1, limit = 10) => request(`/board/list?page=${page}&limit=${limit}`),
    boardGet: (id) => request(`/board/get/${id}`),
    boardWrite: (data, token) => request('/board/write', { method: 'POST', body: data, token }),
    boardUpdate: (id, data, token) => request(`/board/update/${id}`, { method: 'PUT', body: data, token }),
    boardDelete: (id, token) => request(`/board/delete/${id}`, { method: 'DELETE', token })
};
