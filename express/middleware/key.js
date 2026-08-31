require('dotenv').config();

// .env 의 JWT_SECRET 값을 사용 (없으면 서버 실행 중에만 유효한 임시 키 생성)
const crypto = require('crypto');
const KEY = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');

module.exports = KEY;
