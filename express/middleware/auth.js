const jwt = require('jsonwebtoken');
const KEY = require('./key');

// 로그인이 필요한 라우터 앞에 붙여서 토큰을 검증하는 미들웨어
function auth(req, res, next) {
    const token = req.headers.authorization;
    if (token == null) {
        return res.status(401).json({ success: false, msg: '토큰이 없습니다.' });
    }

    try {
        const info = jwt.verify(token, KEY);
        req.member = info; // 이후 라우터에서 req.member.id 로 사용
        next();
    } catch (e) {
        return res.status(401).json({ success: false, msg: '유효하지 않은 토큰 입니다.' });
    }
}

module.exports = auth;
