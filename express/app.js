const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./db');

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/member', require('./routers/member_router'));
app.use('/board', require('./routers/board_router'));

connectDB();

app.all('/', (req, res) => {
    res.send('/member 로 회원 가입/로그인, /board 로 게시글 CRUD 를 이용하세요.');
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
